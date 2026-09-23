import { Link } from "react-router-dom";
import "./ManageSportClasses.css";

function ManageSportClasses() {
    return (
        <div className="manage-classes-page">
            <h2>Manage Sport Classes</h2>
            <p className="page-subtitle">Select an administrative action to update the club sport classes.</p>

            <div className="actions-wrapper">
                {/* Card de adăugare */}
                <Link to="/managesportclasses/add" className="action-card add-btn">
                    <span className="action-icon">➕</span>
                    Add New Class
                </Link>

                {/* Card de ștergere */}
                <Link to="/managesportclasses/delete" className="action-card delete-btn">
                    <span className="action-icon">🗑️</span>
                    Delete Class
                </Link>
            </div>
        </div>
    );
}

export default ManageSportClasses;