import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import "./Calendar.css";

function Calendar() {
    const [events, setEvents] = useState([]);

    const fetchSchedules = () => {
        // Expandăm atât SportClass cât și Bookings ca să știm numărul curent de clienți
        fetch("http://localhost:5275/odata/ClassSchedules?$expand=SportClass,Bookings")
            .then(res => res.json())
            .then(data => {
                const now = new Date();

                const ev = data.value.map(s => {
                    const startTime = new Date(s.StartTime);
                    const totalBookings = s.Bookings?.length || 0;
                    const availableSpots = 5 - totalBookings;

                    // 💡 Calculăm culoarea evenimentului pe baza regulilor tale
                    let statusClass = "spots-green"; // Implicit: verde (cel puțin 3 locuri)

                    if (startTime < now || totalBookings >= 5) {
                        statusClass = "spots-grey"; // Trecut sau plin -> Not available
                    } else if (availableSpots === 1 || availableSpots === 2) {
                        statusClass = "spots-orange"; // Doar 1 sau 2 locuri rămase -> Portocaliu
                    }

                    return {
                        id: s.Id,
                        title: `${s.SportClass.Name} (${totalBookings}/5)`,
                        start: s.StartTime,
                        end: s.EndTime,
                        classNames: [statusClass], // Transmitem clasa CSS către FullCalendar
                        extendedProps: {
                            startTime: startTime,
                            totalBookings: totalBookings
                        }
                    };
                });
                setEvents(ev);
            })
            .catch(err => console.error("Error loading schedules:", err));
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const handleEventClick = async (info) => {

        const scheduleId = Number(info.event.id);

        const className = info.event.title;

        const classStartTime = info.event.extendedProps.startTime;

        const totalBookings = info.event.extendedProps.totalBookings;


        const loggedInUserStr = localStorage.getItem("user");

        if (!loggedInUserStr) {

            alert("You must log in!");

            return;
        }

        const userObj = JSON.parse(loggedInUserStr);

        const token = userObj.token;

// ⏱️ 1. Verificare clasă în trecut sau plină

        const now = new Date();

        if (classStartTime < now) {

            alert("You cannot book a class that has already taken place!");

            return;

        }

        if (totalBookings >= 5) {

            alert("This class is fully booked!");

            return;

        }





        const classHour = classStartTime.getHours();



        const hasTimeLimitedMembership = userObj.membershipName?.toLowerCase().includes("morning");



        if (hasTimeLimitedMembership && classHour >= 15) {

            alert("Access Denied! Your membership is only valid until 15:00 (3 PM), and this class starts later.");

            return;

        }



        const confirmBooking = window.confirm(`Do you want to book the class: ${className}?`);

        if (!confirmBooking) return;



        try {

            const response = await fetch("http://localhost:5275/odata/ClassBookings", {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    "Authorization": `Bearer ${token}`

                },

                body: JSON.stringify({

                    classScheduleId: scheduleId

                })

            });



            if (response.status === 201 || response.ok) {

                alert(`The class ${className} has been booked successfully!`);

                fetchSchedules(); // Reîncărcăm calendarul ca să se schimbe culoarea/locurile pe loc

            } else {

                const errorText = await response.text();

                alert(errorText || "An error occurred!");

            }

        } catch (error) {

            console.error("Error booking class:", error);

            alert("An error occurred at server connection!");

        }

    };

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h2>Class Calendar</h2>

            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin]}
                initialView="timeGridWeek"
                events={events}
                height="70vh"
                eventClick={handleEventClick}
                slotMinTime="06:00:00" // Opțional: pornește calendarul vizual de la ora 06:00
                slotMaxTime="22:00:00"
            />

            {/* 📋 LEGENDA IMPLEMENTATĂ JOS ÎN ENGLEZĂ */}
            <div className="calendar-legend-container">
                <h4>Calendar Legend</h4>
                <div className="legend-flex">
                    <div className="legend-item">
                        <span className="legend-box grey-box"></span>
                        <span><strong>Grey:</strong> Not Available (Class is in the past or fully booked - 5/5 clients)</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-box green-box"></span>
                        <span><strong>Green:</strong> Available (Good availability - 3 or more spots remaining)</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-box orange-box"></span>
                        <span><strong>Orange:</strong> Limited Spots (Hurry up! Only 1 or 2 spots left)</span>
                    </div>
                </div>
                <p className="legend-note">* Note: Clients with memberships restricted until 15:00 (3 PM) cannot register for classes starting at or after 15:00.</p>
            </div>
        </div>
    );
}

export default Calendar;