import React from 'react';
import Page from '../components/Page';
import '../css/main.css';

import kudelaLogo from "../assets/logo.png";
import kudelaLogoWhite from "../assets/logo-white.png";
import calPolyLogo from "../assets/CalPolyHumboldt_primary_green.png";
import labLogo from "../assets/CalPolyHumboldtTelonicherMarineLab_Logo.png";

class HumboldtLab extends React.Component {

    render() {
        return (
            <main>
                <div className="header">
                    <div className="logo-container">
                        <img className="header-logo-medium" src={labLogo} alt="Telonicher Marine Lab logo"></img>
                        <div className="small-logo-container">
                            <img className="header-logo-small background-logo" src={calPolyLogo} alt="Kudela Lab logo"></img>
                        </div>
                    </div>
                    <div>
                        <h2 className="subheading">Cal Poly Humboldt  |  Telonicher Marine Lab</h2>
                        <h1 className="main-heading">HAB Tracker</h1>
                        <h3 className="description-heading">
                        Keep track of harmful algae in Humboldt Bay, California.
                        </h3>
                    </div>
                </div>
                {<Page name="humboldt"/>}
                <div className='footer'>
                    <div>
                        <h2 className="subheading footer-heading">Cal Poly Humboldt  |  Telonicher Marine Lab</h2>
                        <div className="footer-links">
                            <a className="footer-link" target="_blank" href="https://ifcb.caloos.org/timeline?dataset=cal-poly-humboldt-hioc">Humboldt IFCB Dashboard</a>
                            <a className="footer-link" target="_blank" href="https://marinelab.humboldt.edu/">Lab Website</a>
                        </div>
                        <p className='disclaimer'><b>Disclaimer:</b> We are providing these data as a service to interested parties. Our goal is to deliver a near-real time summary of potentially harmful algal species in the water.  Cell identification data are from an automated classifier.  The IDs and concentrations are not necessarily manually confirmed and there may be errors.</p>
                    </div>
                    <img className="footer-logo" src={kudelaLogo} alt="Telonicher Marine Lab logo"></img>
                </div>
            </main>
        );
    }
}

export default HumboldtLab;
