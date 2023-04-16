import React from 'react';
import Page from '../components/Page';
import '../css/main.css';

import logo from "../assets/logo.png";
import logoWhite from "../assets/logo-white.png";

class KudelaLab extends React.Component {

    render() {
        return (
            <main>
                <div className="header">
                    <img className="header-logo" src={logoWhite} alt="Kudela Lab logo"></img>
                    <div>
                        <h2 className="subheading">Kudela Lab</h2>
                        <h1 className="main-heading">HAB Tracker</h1>
                        <h3 className="description-heading">
                        Keep track of harmful algae at the Santa Cruz Wharf in California.
                        </h3>
                    </div>
                </div>
                {<Page/>}
                <div className='footer'>
                    <div>
                        <h2 className="subheading footer-heading">Kudela Lab</h2>
                        <div className="footer-links">
                            <a className="footer-link" target="_blank" href="http://akashiwo.oceandatacenter.ucsc.edu:8000/timeline?dataset=SCW">SCW IFCB Dashboard</a>
                            <a className="footer-link" target="_blank" href="http://oceandatacenter.ucsc.edu/">Lab Website</a>
                        </div>
                        <p className='disclaimer'><b>Disclaimer:</b> We are providing these data as a service to interested parties. Our goal is to deliver a near-real time summary of potentially harmful algal species in the water.  Cell identification data are from an automated classifier.  The IDs and concentrations are not necessarily manually confirmed and there may be errors.</p>
                    </div>
                    <img className="footer-logo" src={logo} alt="Kudela Lab logo"></img>
                </div>
            </main>
        );
    }
}

export default KudelaLab;
