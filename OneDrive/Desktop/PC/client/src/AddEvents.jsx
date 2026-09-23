import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddEvents.css"; // 💡 Importăm fișierul de stiluri dedicat

function AddEvents() {
    const [myClasses, setMyClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [existingSchedules, setExistingSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
    const loggedInUser = localStorage.getItem("user");
    const token = loggedInUser ? JSON.parse(loggedInUser).token : null;

    const availableTimeSlots = [
        { label: "06:00 - 07:00", startHour: 6, endHour: 7 },
        { label: "07:00 - 08:00", startHour: 7, endHour: 8 },
        { label: "08:00 - 09:00", startHour: 8, endHour: 9 },
        { label: "09:00 - 10:00", startHour: 9, endHour: 10 },
        { label: "10:00 - 11:00", startHour: 10, endHour: 11 },
        { label: "11:00 - 12:00", startHour: 11, endHour: 12 },
        { label: "12:00 - 13:00", startHour: 12, endHour: 13 },
        { label: "13:00 - 14:00", startHour: 13, endHour: 14 },
        { label: "14:00 - 15:00", startHour: 14, endHour: 15 },
        { label: "15:00 - 16:00", startHour: 15, endHour: 16 },
        { label: "16:00 - 17:00", startHour: 16, endHour: 17 },
        { label: "17:00 - 18:00", startHour: 17, endHour: 18 },
        { label: "18:00 - 19:00", startHour: 18, endHour: 19 },
        { label: "19:00 - 20:00", startHour: 19, endHour: 20 },
        { label: "20:00 - 21:00", startHour: 20, endHour: 21 },
        { label: "21:00 - 22:00", startHour: 21, endHour: 22},
    ];

    useEffect(() => {
        if (!loggedInUser) {
            setErrorMessage("You must be logged in as a trainer to add events.");
            setLoading(false);
            return;
        }

        const fetchTrainer = fetch("http://localhost:5275/api/auth/my-account", {
            headers: { "Authorization": `Bearer ${token}` }
        }).then(res => res.json());

        const fetchSchedules = fetch("http://localhost:5275/odata/ClassSchedules")
            .then(res => res.json());

        Promise.all([fetchTrainer, fetchSchedules])
            .then(([trainerData, scheduleData]) => {
                const trainerClasses = trainerData.assignedClasses || trainerData.classes || [];
                setMyClasses(trainerClasses);
                if (trainerClasses.length > 0) {
                    setSelectedClassId(trainerClasses[0].id || trainerClasses[0].Id);
                }
                setExistingSchedules(scheduleData.value || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setErrorMessage("Error loading database information.");
                setLoading(false);
            });
    }, [loggedInUser, token]);

    const todayStr = new Date().toISOString().split("T")[0];

    const isSlotTaken = (slot) => {
        if (!selectedDate) return false;

        const todayObj = new Date();
        const todayStr = todayObj.toISOString().split("T")[0];

        if (selectedDate === todayStr) {
            const currentHour = todayObj.getHours();
            if (slot.startHour <= currentHour) {
                return true;
            }
        }

        return existingSchedules.some(s => {
            const scheduleStart = new Date(s.StartTime);
            const sameDay = scheduleStart.toISOString().split("T")[0] === selectedDate;
            const sameHour = scheduleStart.getHours() === slot.startHour;
            return sameDay && sameHour;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!selectedClassId || !selectedDate || !selectedSlot) {
            alert("Please select a class, a date, and an available time slot.");
            return;
        }

        const slotDetails = availableTimeSlots.find(s => s.label === selectedSlot);

        const startTime = new Date(`${selectedDate}T${String(slotDetails.startHour).padStart(2, '0')}:00:00`);
        const endTime = new Date(`${selectedDate}T${String(slotDetails.endHour).padStart(2, '0')}:00:00`);

        const payload = {
            SportClassId: Number(selectedClassId),
            StartTime: startTime.toISOString(),
            EndTime: endTime.toISOString()
        };

        try {
            const response = await fetch("http://localhost:5275/odata/ClassSchedules", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.status === 201 || response.ok) {
                alert("Class successfully scheduled!");
                navigate("/calendar");
            } else {
                const textError = await response.text();
                setErrorMessage(textError || "An error occurred while scheduling.");
            }
        } catch (err) {
            console.error(err);
            setErrorMessage("Could not reach the server.");
        }
    };

    if (loading) return <div className="add-events-container">Loading data...</div>;

    return (
        <div className="add-events-container">
            <h2>Schedule a New Class</h2>
            <p className="subtitle">Choose a class, a future date, and an available hourly interval.</p>

            {errorMessage && (
                <div className="error-banner">
                    ⚠️ {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* 1. SELECȚIE CLASĂ */}
                <div className="form-group">
                    <label>Select Class:</label>
                    <select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="form-input"
                    >
                        {myClasses.length === 0 ? (
                            <option value="">No assigned classes found</option>
                        ) : (
                            myClasses.map((c) => (
                                <option key={c.id || c.Id} value={c.id || c.Id}>
                                    {c.name || c.Name}
                                </option>
                            ))
                        )}
                    </select>
                </div>

                {/* 2. SELECȚIE ZI */}
                <div className="form-group">
                    <label>Choose Date (Future only):</label>
                    <input
                        type="date"
                        min={todayStr}
                        value={selectedDate}
                        onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setSelectedSlot("");
                        }}
                        className="form-input"
                    />
                </div>

                {/* 3. SELECȚIE INTERVAL ORAR */}
                {selectedDate && (
                    <div className="form-group">
                        <label>Select Available Time Slot:</label>
                        <div className="slots-grid">
                            {availableTimeSlots.map((slot) => {
                                const taken = isSlotTaken(slot);
                                const isSelected = selectedSlot === slot.label;

                                return (
                                    <button
                                        key={slot.label}
                                        type="button"
                                        disabled={taken}
                                        onClick={() => setSelectedSlot(slot.label)}
                                        className={`slot-button ${isSelected ? "selected" : ""}`}
                                    >
                                        {slot.label} {taken && " (X)"}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={myClasses.length === 0 || !selectedDate || !selectedSlot}
                    className="submit-btn"
                >
                    Confirm Event Creation
                </button>
            </form>
        </div>
    );
}

export default AddEvents;