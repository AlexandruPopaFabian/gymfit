import { Link } from "react-router-dom";
import "./ManageTrainers.css";

function ManageTrainers(){
    return (
        <div className="manage-trainers-page">
            <h2>Manage Trainers</h2>
            <p className="page-subtitle">Select an administrative action to update the club trainers.</p>

            <div className="actions-wrapper">
                {/* Card de adăugare */}
                <Link to="/managetrainers/add" className="action-card add-btn">
                    <span className="action-icon">➕</span>
                    Add New Trainer
                </Link>

                {/* Card de ștergere */}
                <Link to="/managetrainers/delete" className="action-card delete-btn">
                    <span className="action-icon">🗑️</span>
                    Delete Trainer
                </Link>
            </div>
        </div>
    )
}

export default ManageTrainers;