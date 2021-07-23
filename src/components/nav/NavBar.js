import { Dropdown, Badge } from "react-bootstrap";
import VibeHuntBanner from '../images/VibeHunt.jpg';
import './navbar.css';

export const NavBar = () => {
    return (
        <nav className="nav_bar">
            <div className="vibehunt_title">
                <img src={VibeHuntBanner} width="260rem" height="60rem" />
            </div>
            <div className="dropdown_holder">
                <Dropdown id="vibehunt_dropdown">
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Menu
                    </Dropdown.Toggle>
                        <Dropdown.Menu id="dropdown-background">
                            <Dropdown.Item className="dropdown-item" href="/">Home</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item className="dropdown-item" href="/favorites">
                                Favorites 
                                <Badge variant="secondary">x</Badge>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                </Dropdown>
            </div>
        </nav>
        )
}