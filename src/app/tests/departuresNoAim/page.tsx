import { convertDateToUTC } from '@/core-actions/core/utils/time-handling';
import React from 'react'

type Props = {}

function DeparturesNoAimPage({ }: Props) {
    // var d = new Date()
    // //add 30 mins to current time
    // var h: string | number = d.getHours();
    // var m: string | number = d.getMinutes();
    // const timeOffsetInMinutes = 20;
    // h = m + timeOffsetInMinutes >= 60 ? h + 1 > 23 ? 0 : h + 2 : h
    // m = m + timeOffsetInMinutes >= 60 ? m + timeOffsetInMinutes - 60 : m + timeOffsetInMinutes;
    // h = h < 10 ? '0' + h : h;
    // m = m < 10 ? '0' + m : m;
    // console.log("h: ", h, "m: ", m);

    return (
        <>
            {/* saved from url=(0056)https://www.realtimetrains.co.uk/search/detailed/gb-nr:EUS */}
            <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta httpEquiv="x-ua-compatible" content="ie=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="author" content="Realtime Trains" />
            <meta
                name="description"
                content="Live train departures from London Euston. From Realtime Trains, an independent source of train running info for Great Britain."
            />
            <meta
                property="og:title"
                content="Realtime Trains | Live Departures from London Euston"
            />
            <meta
                property="twitter:title"
                content="Realtime Trains | Live Departures from London Euston"
            />
            <title>DETAILED Realtime Trains | Live Departures from London Euston</title>
            {/* preloads */}
            <link
                rel="preload"
                href="https://www.realtimetrains.co.uk/assets/fonts/riftsoft-bold-webfont.woff"
                as="font"
                type="font/woff2"
                crossOrigin=""
            />
            <link
                rel="preload"
                href="https://www.realtimetrains.co.uk/assets/fonts/uraniamed-webfont.woff2"
                as="font"
                type="font/woff2"
                crossOrigin=""
            />
            <link
                rel="stylesheet"
                href="./Realtime Trains _ Live Departures from London Euston_files/app-b1a659b9.css"
            />
            {/* ad load here */}
            <meta className="foundation-mq" name="foundation-mq" content="" />
            <style
                type="text/css"
                dangerouslySetInnerHTML={{
                    __html:
                        ' .qc-cmp-button.qc-cmp-secondary-button:hover {    background-color: #368bd6 !important;    border-color: transparent !important;  }  .qc-cmp-button.qc-cmp-secondary-button:hover {    color: #ffffff !important;  }  .qc-cmp-button.qc-cmp-secondary-button {    color: #368bd6 !important;  }  .qc-cmp-button.qc-cmp-secondary-button {    background-color: #eee !important;    border-color: transparent !important;  } #qc-cmp2-ui * { font-family: urania,"Helvetica Neue",Helvetica,Roboto,Arial,sans-serif !important;}'
                }}
            />
            <div className="ad-load-header" />
            {/* Default favicon */}
            <link
                rel="icon"
                href="https://www.realtimetrains.co.uk/assets/img/favicon/favicon-32-e1e094d9.png"
                sizes="32x32"
            />
            <link
                rel="icon"
                href="https://www.realtimetrains.co.uk/assets/img/favicon/favicon-128-f0525294.png"
                sizes="128x128"
            />
            <link
                rel="icon"
                href="https://www.realtimetrains.co.uk/assets/img/favicon/favicon-196-46828a3b.png"
                sizes="196x196"
            />
            {/* iOS */}
            <link
                rel="apple-touch-icon"
                href="https://www.realtimetrains.co.uk/assets/img/favicon/favicon-152-8742b687.png"
                sizes="152x152"
            />
            <link
                rel="apple-touch-icon"
                href="https://www.realtimetrains.co.uk/assets/img/favicon/favicon-180-ddf7b4d0.png"
                sizes="180x180"
            />
            {/* Android */}
            <link
                rel="shortcut icon"
                href="https://www.realtimetrains.co.uk/assets/img/favicon/favicon-196-46828a3b.png"
                sizes="196x196"
            />
            <div className="top-bar-container">
                <div className="row column">
                    <div className="top-bar">
                        <div className="top-bar-title">
                            <div className="logo-container">
                                <a href="https://www.realtimetrains.co.uk/">
                                    <div className="logo" aria-label="RTT Logo" />
                                </a>
                            </div>
                        </div>
                        <div
                            className="text-right responsive-menu"
                            data-responsive-toggle="top-bar-items"
                            style={{ display: "none" }}
                        >
                            <div className="title-bar-title" id="title-bar-title">
                                Menu
                            </div>
                            <button
                                className="menu-icon"
                                type="button"
                                data-toggle="top-bar-items"
                                aria-labelledby="title-bar-title"
                            />
                        </div>
                        <div id="top-bar-items">
                            <div className="top-bar-left">
                                <ul className="menu">
                                    <li>
                                        <a href="https://blog.realtimetrains.com/">News</a>
                                    </li>
                                    <li className="active">
                                        <a href="https://www.realtimetrains.co.uk/search/">Search</a>
                                    </li>
                                    <li>
                                        <a href="https://www.realtimetrains.co.uk/about/">Contact</a>
                                    </li>
                                    <li>
                                        <a href="https://shop.realtimetrains.com/">Shop</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="top-bar-right">
                                <form
                                    method="get"
                                    action="https://www.realtimetrains.co.uk/search/handler"
                                >
                                    <ul className="menu">
                                        <li>
                                            <input
                                                type="search"
                                                placeholder="Quick Search"
                                                name="qsearch"
                                            />
                                        </li>
                                        <li>
                                            <button className="button" type="submit">
                                                Go
                                            </button>
                                        </li>
                                    </ul>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="spacer" />
            <main>
                <div className="grid-container">
                    <div className="panelcontainer small-right">
                        <div className="panel large">
                            <div className="header-view">
                                <div className="header-text">
                                    <h3>
                                        London Euston
                                        <small>Live Departures</small>
                                    </h3>
                                </div>
                                <div className="toggle-box">
                                    <div className="toggle">
                                        <div className="active">Departures</div>
                                        <a href="https://www.realtimetrains.co.uk/search/simple/gb-nr:EUS/arrivals">
                                            Arrivals
                                        </a>
                                    </div>
                                    <div className="toggle">
                                        <div className="active">Simple</div>
                                        <a href="https://www.realtimetrains.co.uk/search/detailed/gb-nr:EUS">
                                            Detailed
                                        </a>
                                    </div>{" "}
                                </div>
                            </div>
                            <div className="callout condensed">
                                <div className="servicelist">
                                    <div className="titlerow show-for-medium">
                                        <div className="stp">STP</div>
                                        <div className="time plan a">Plan Arr</div>
                                        <div className="time real a">Act Arr</div>
                                        <div className="location o">Origin</div>
                                        <div className="platform">Pl</div>
                                        <div className="tid">ID</div>
                                        <div className="toc">TOC</div>
                                        <div className="location d">Destination</div>
                                        <div className="time plan d">Plan Dep</div>
                                        <div className="time real d">Act Dep</div>
                                        <div className="cars">
                                            <span >
                                                <i className="glyphicons glyphicons-train"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <a className="service " href="https://www.realtimetrains.co.uk/service/gb-nr:C31714/2024-11-15/detailed#allox_id=0">
                                        <div className="stp ">WTT</div>
                                        <div className="time plan a gbtt">0753</div>
                                        <div className="time real a  act c late">0759¼</div>
                                        <div className="location o ">
                                            <span>Liverpool Lime Street</span>
                                        </div>
                                        <div className="platform c act ">14</div>
                                        <div className="tid">1R06</div>
                                        <div className="toc">VT</div>
                                        <div className="location d ts">Terminates here</div>
                                        <div className="time plan d wtt ts"></div>
                                        <div className="time real d  exp  "></div>
                                        <div className="cars c">
                                            <div>11</div>
                                        </div>
                                        <div className="classname c">Avanti WC Pendolino</div>
                                        <div className="lb lb1"></div>
                                        <div className="lb lb2"></div>
                                        <div className="lb lb3"></div>
                                    </a>
                                    <a className="service origin" href="https://www.realtimetrains.co.uk/service/gb-nr:C78281/2024-11-15/detailed">
                                        <div className="stp ">WTT</div>
                                        <div className="time plan a ts"></div>
                                        <div className="time real a"></div>
                                        <div className="location o ts">Starts here</div>
                                        <div className="platform c act ">10</div>
                                        <div className="tid">2T13</div>
                                        <div className="toc">LM</div>
                                        <div className="location d ">
                                            <span>Tring</span>
                                        </div>
                                        <div className="time plan d gbtt ">0754</div>
                                        <div className="time real d  act c rt">0753¾</div>
                                        <div className="cars"></div>
                                        <div className="classname"></div>
                                        <div className="lb lb1"></div>
                                        <div className="lb lb2"></div>
                                        <div className="lb lb3"></div>
                                    </a>
                                    <a className="service origin" href="https://www.realtimetrains.co.uk/service/gb-nr:C76069/2024-11-15/detailed">
                                        <div className="stp diff">VAR</div>
                                        <div className="time plan a ts"></div>
                                        <div className="time real a"></div>
                                        <div className="location o ts">Starts here</div>
                                        <div className="platform c act ">12</div>
                                        <div className="tid">1Y17</div>
                                        <div className="toc">LM</div>
                                        <div className="location d ">
                                            <span>Birmingham New Street</span>
                                        </div>
                                        <div className="time plan d gbtt ">0756</div>
                                        <div className="time real d  act c rt">0756</div>
                                        <div className="cars"></div>
                                        <div className="classname"></div>
                                        <div className="lb lb1"></div>
                                        <div className="lb lb2"></div>
                                        <div className="lb lb3"></div>
                                    </a>
                                    <a className="service " href="https://www.realtimetrains.co.uk/service/gb-nr:C31715/2024-11-15/detailed">
                                        <div className="stp ">WTT</div>
                                        <div className="time plan a gbtt">0757</div>
                                        <div className="time real a canx ">
                                            <span >Cancel</span>
                                        </div>
                                        <div className="location o ">
                                            <span>Wolverhampton</span>
                                        </div>
                                        <div className="platform">-</div>
                                        <div className="tid">1R07</div>
                                        <div className="toc">VT</div>
                                        <div className="location d ts">Terminates here</div>
                                        <div className="time plan d wtt ts"></div>
                                        <div className="time real d h exp  "></div>
                                        <div className="cars"></div>
                                        <div className="classname"></div>
                                        <div className="lb lb1"></div>
                                        <div className="lb lb2"></div>
                                        <div className="lb lb3"></div>
                                    </a>
                                    <a className="service " href="https://www.realtimetrains.co.uk/service/gb-nr:C76307/2024-11-15/detailed">
                                        <div className="stp ">WTT</div>
                                        <div className="time plan a gbtt">0757</div>
                                        <div className="time real a  act c rt">0757¼</div>
                                        <div className="location o ">
                                            <span>Bletchley</span>
                                        </div>
                                        <div className="platform c act ">10</div>
                                        <div className="tid">2B06</div>
                                        <div className="toc">LM</div>
                                        <div className="location d ts">Terminates here</div>
                                        <div className="time plan d wtt ts"></div>
                                        <div className="time real d  exp  "></div>
                                        <div className="cars"></div>
                                        <div className="classname"></div>
                                        <div className="lb lb1"></div>
                                        <div className="lb lb2"></div>
                                        <div className="lb lb3"></div>
                                    </a>
                                    <a className="service nonpax" href="https://www.realtimetrains.co.uk/service/gb-nr:27366/2024-11-15/detailed#allox_id=0">
                                        <div className="stp diff">VST</div>
                                        <div className="time plan a wtt">0757</div>
                                        <div className="time real a  act c rt">0801½</div>
                                        <div className="location o ">
                                            <span>Wolverhampton</span>
                                        </div>
                                        <div className="platform c act ">5</div>
                                        <div className="tid">5R07</div>
                                        <div className="toc">VT</div>
                                        <div className="location d ts">Terminates here</div>
                                        <div className="time plan d wtt ts"></div>
                                        <div className="time real d  exp  "></div>
                                        <div className="cars c">
                                            <div>11</div>
                                        </div>
                                        <div className="classname c">Avanti WC Pendolino</div>
                                        <div className="lb lb1"></div>
                                        <div className="lb lb2"></div>
                                        <div className="lb lb3"></div>
                                    </a>
                                    <a className="service origin" href="https://www.realtimetrains.co.uk/service/gb-nr:P89788/2024-11-15/detailed">
                                        <div className="stp ">WTT</div>
                                        <div className="time plan a ts"></div>
                                        <div className="time real a"></div>
                                        <div className="location o ts">Starts here</div>
                                        <div className="platform c act ">9</div>
                                        <div className="tid">2D59</div>
                                        <div className="toc">LO</div>
                                        <div className="location d ">
                                            <span>Watford Junction</span>
                                        </div>
                                        <div className="time plan d gbtt ">0758</div>
                                        <div className="time real d  act c rt">0758</div>
                                        <div className="cars"></div>
                                        <div className="classname"></div>
                                        <div className="lb lb1"></div>
                                        <div className="lb lb2"></div>
                                        <div className="lb lb3"></div>
                                    </a>
                                    <a className="service " href="https://www.realtimetrains.co.uk/service/gb-nr:C31716/2024-11-15/detailed#allox_id=0">
                                        <div className="stp ">WTT</div>
                                        <div className="time plan a gbtt">0800</div>
                                        <div className="time real a  act c late">0811¾</div>
                                        <div className="location o ">
                                            <span>Lancaster</span>
                                        </div>
                                        <div className="platform c act ">3</div>
                                        <div className="tid">1R08</div>
                                        <div className="toc">VT</div>
                                        <div className="location d ts">Terminates here</div>
                                        <div className="time plan d wtt ts"></div>
                                        <div className="time real d  exp  "></div>
                                        <div className="cars c">
                                            <div>9</div>
                                        </div>
                                        <div className="classname c">Avanti WC Pendolino</div>
                                        <div className="lb lb1"></div>
                                        <div className="lb lb2"></div>
                                        <div className="lb lb3"></div>
                                    </a>
                                    <a className="service nonpax origin" href="https://www.realtimetrains.co.uk/service/gb-nr:S86427/2024-11-15/detailed#allox_id=0">
                                        <div className="stp diff">STP</div>
                                        <div className="time plan a ts"></div>
                                        <div className="time real a"></div>
                                        <div className="location o ts">Starts here</div>
                                        <div className="platform c act ">6</div>
                                        <div className="tid">3K88</div>
                                        <div className="toc">VT</div>
                                        <div className="location d ">
                                            <span>Crewe</span>
                                        </div>
                                        <div className="time plan d wtt ">0802</div>
                                        <div className="time real d  act c rt">0801¾</div>
                                        <div className="cars c">
                                            <div>5</div>
                                        </div>
                                        <div className="classname c">Avanti WC Evero</div>
                                        <div className="lb lb1"></div>
                                        <div className="lb lb2"></div>
                                        <div className="lb lb3"></div>
                                    </a>
                                    <a className="service origin" href="https://www.realtimetrains.co.uk/service/gb-nr:C78285/2024-11-15/detailed">
                                        <div className="stp ">WTT</div>
                                        <div className="time plan a ts"></div>
                                        <div className="time real a"></div>
                                        <div className="location o ts">Starts here</div>
                                        <div className="platform c act ">8</div>
                                        <div className="tid">2T15</div>
                                        <div className="toc">LM</div>
                                        <div className="location d ">
                                            <span>Tring</span>
                                        </div>
                                        <div className="time plan d gbtt ">0804</div>
                                        <div className="time real d  act c rt">0803¾</div>
                                        <div className="cars"></div>
                                        <div className="classname"></div>
                                        <div className="lb lb1"></div>
                                        <div className="lb lb2"></div>
                                        <div className="lb lb3"></div>
                                    </a>
                                    <a className="service " href="https://www.realtimetrains.co.uk/service/gb-nr:C75911/2024-11-15/detailed">
                                        <div className="stp ">WTT</div>
                                        <div className="time plan a gbtt">0805</div>
                                        <div className="time real a  act c rt">0807½</div>
                                        <div className="location o ">
                                            <span>Crewe</span>
                                        </div>
                                        <div className="platform c act ">13</div>
                                        <div className="tid">1U02</div>
                                        <div className="toc">LM</div>
                                        <div className="location d ts">Terminates here</div>
                                        <div className="time plan d wtt ts"></div>
                                        <div className="time real d  exp  "></div>
                                        <div className="cars"></div>
                                        <div className="classname"></div>
                                        <div className="lb lb1"></div>
                                        <div className="lb lb2"></div>
                                        <div className="lb lb3"></div>
                                    </a>
                                    <a className="service nonpax" href="https://www.realtimetrains.co.uk/service/gb-nr:27408/2024-11-15/detailed">
                                        <div className="stp diff">VST</div>
                                        <div className="time plan a wtt">0807</div>
                                        <div className="time real a canx ">
                                            <span >Cancel</span>
                                        </div>
                                        <div className="location o ">
                                            <span>Wolverhampton</span>
                                        </div>
                                        <div className="platform">-</div>
                                        <div className="tid">5R09</div>
                                        <div className="toc">VT</div>
                                        <div className="location d ts">Terminates here</div>
                                        <div className="time plan d wtt ts"></div>
                                        <div className="time real d h exp  "></div>
                                        <div className="cars"></div>
                                        <div className="classname"></div>
                                        <div className="lb lb1"></div>
                                        <div className="lb lb2"></div>
                                        <div className="lb lb3"></div>
                                    </a>
                                    <a className="service " href="https://www.realtimetrains.co.uk/service/gb-nr:C31717/2024-11-15/detailed">
                                        <div className="stp ">WTT</div>
                                        <div className="time plan a gbtt">0807</div>
                                        <div className="time real a canx ">
                                            <span >
                                                Cancel
                                            </span>
                                        </div>
                                        <div className="location o ">
                                            <span>Wolverhampton</span>
                                        </div>
                                        <div className="platform">-</div>
                                        <div className="tid">1R09</div>
                                        <div className="toc">VT</div>
                                        <div className="location d ts">Terminates here</div>
                                        <div className="time plan d wtt ts"></div>
                                        <div className="time real d h exp  "></div>
                                        <div className="cars"></div>
                                        <div className="classname"></div>
                                        <div className="lb lb1"></div>
                                        <div className="lb lb2"></div>
                                        <div className="lb lb3"></div>
                                    </a>
                                    <a className="service " href="https://www.realtimetrains.co.uk/service/gb-nr:P89328/2024-11-15/detailed">
                                        <div className="stp ">WTT</div>
                                        <div className="time plan a gbtt">0811</div>
                                        <div className="time real a  act c rt">0807½</div>
                                        <div className="location o ">
                                            <span>Watford Junction</span>
                                        </div>
                                        <div className="platform c act ">9</div>
                                        <div className="tid">2C08</div>
                                    </a>
                                </div>
                            </div>
                            <div className="panel small">
                                <h3>Search Menu</h3>
                                <div className="callout detailed" id="searchbox">
                                    <form
                                        method="get"
                                        action="https://www.realtimetrains.co.uk/search/handler"
                                    >
                                        <label>
                                            Location
                                            <span
                                                className="tt-typeahead"
                                                style={{ position: "relative", display: "inline-block" }}
                                            >
                                                <input
                                                    type="text"
                                                    name="location"
                                                    placeholder="Location"
                                                    defaultValue="London Euston"
                                                    id="mainlocsearch"
                                                    autoComplete="off"
                                                    className="tt-input"
                                                    spellCheck="false"
                                                    dir="auto"
                                                    aria-owns="mainlocsearch_listbox"
                                                    role="combobox"
                                                    aria-autocomplete="list"
                                                    aria-expanded="false"
                                                    style={{ position: "relative", verticalAlign: "top" }}
                                                />
                                                <span
                                                    role="status"
                                                    aria-live="polite"
                                                    style={{
                                                        position: "absolute",
                                                        padding: 0,
                                                        border: 0,
                                                        height: 1,
                                                        width: 1,
                                                        marginBottom: "-1px",
                                                        marginRight: "-1px",
                                                        overflow: "hidden",
                                                        clip: "rect(0px, 0px, 0px, 0px)",
                                                        whiteSpace: "nowrap"
                                                    }}
                                                />
                                                <pre
                                                    aria-hidden="true"
                                                    style={{
                                                        position: "absolute",
                                                        visibility: "hidden",
                                                        whiteSpace: "pre",
                                                        fontFamily:
                                                            'urania, "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif',
                                                        fontSize: 16,
                                                        fontStyle: "normal",
                                                        fontVariant: "normal",
                                                        fontWeight: 400,
                                                        wordSpacing: 0,
                                                        letterSpacing: 0,
                                                        textIndent: 0,
                                                        textRendering: "auto",
                                                        textTransform: "none"
                                                    }}
                                                />
                                                <div
                                                    role="listbox"
                                                    className="tt-menu"
                                                    id="mainlocsearch_listbox"
                                                    style={{
                                                        position: "absolute",
                                                        top: "100%",
                                                        left: 0,
                                                        zIndex: 100,
                                                        display: "none"
                                                    }}
                                                >
                                                    <div
                                                        role="presentation"
                                                        className="tt-dataset tt-dataset-mainlocsearch_stations"
                                                    />
                                                </div>
                                            </span>
                                        </label>
                                        <div className="grid-x group">
                                            <div className="small-6 cell">
                                                <label>
                                                    Date?
                                                    <input
                                                        type="text"
                                                        name="when_date"
                                                        placeholder="Today"
                                                        autoComplete="off"
                                                        defaultValue=""
                                                    />
                                                </label>
                                            </div>
                                            <div className="small-6 cell">
                                                <label>
                                                    When?
                                                    <input
                                                        type="text"
                                                        placeholder="Now"
                                                        autoComplete="off"
                                                        name="when_time"
                                                        defaultValue=""
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="spacer" />
                                        <div className="text-center">
                                            <h5>Filtering</h5>
                                        </div>
                                        <div className="grid-x group">
                                            <div className="small-6 medium-3 xlarge-6 cell">
                                                <label>
                                                    <span className="hide-for-xlarge">Calls </span>
                                                    Has called at
                                                    <span
                                                        className="tt-typeahead"
                                                        style={{ position: "relative", display: "inline-block" }}
                                                    >
                                                        <input
                                                            type="text"
                                                            name="call_previous"
                                                            defaultValue=""
                                                            autoComplete="off"
                                                            id="b9taifcm36"
                                                            className="tt-input"
                                                            spellCheck="false"
                                                            dir="auto"
                                                            aria-owns="b9taifcm36_listbox"
                                                            role="combobox"
                                                            aria-autocomplete="list"
                                                            aria-expanded="false"
                                                            style={{ position: "relative", verticalAlign: "top" }}
                                                        />
                                                        <span
                                                            role="status"
                                                            aria-live="polite"
                                                            style={{
                                                                position: "absolute",
                                                                padding: 0,
                                                                border: 0,
                                                                height: 1,
                                                                width: 1,
                                                                marginBottom: "-1px",
                                                                marginRight: "-1px",
                                                                overflow: "hidden",
                                                                clip: "rect(0px, 0px, 0px, 0px)",
                                                                whiteSpace: "nowrap"
                                                            }}
                                                        />
                                                        <pre
                                                            aria-hidden="true"
                                                            style={{
                                                                position: "absolute",
                                                                visibility: "hidden",
                                                                whiteSpace: "pre",
                                                                fontFamily:
                                                                    'urania, "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif',
                                                                fontSize: 16,
                                                                fontStyle: "normal",
                                                                fontVariant: "normal",
                                                                fontWeight: 400,
                                                                wordSpacing: 0,
                                                                letterSpacing: 0,
                                                                textIndent: 0,
                                                                textRendering: "auto",
                                                                textTransform: "none"
                                                            }}
                                                        />
                                                        <div
                                                            role="listbox"
                                                            className="tt-menu"
                                                            id="b9taifcm36_listbox"
                                                            style={{
                                                                position: "absolute",
                                                                top: "100%",
                                                                left: 0,
                                                                zIndex: 100,
                                                                display: "none"
                                                            }}
                                                        >
                                                            <div
                                                                role="presentation"
                                                                className="tt-dataset tt-dataset-b9taifcm36_stations"
                                                            />
                                                        </div>
                                                    </span>
                                                </label>
                                            </div>
                                            <div className="small-6 medium-3 xlarge-6 cell">
                                                <label>
                                                    <span className="hide-for-xlarge">Calls </span>
                                                    Will call at
                                                    <span
                                                        className="tt-typeahead"
                                                        style={{ position: "relative", display: "inline-block" }}
                                                    >
                                                        <input
                                                            type="text"
                                                            name="call_subsequent"
                                                            defaultValue=""
                                                            autoComplete="off"
                                                            id="ekyof2kxy38"
                                                            className="tt-input"
                                                            spellCheck="false"
                                                            dir="auto"
                                                            aria-owns="ekyof2kxy38_listbox"
                                                            role="combobox"
                                                            aria-autocomplete="list"
                                                            aria-expanded="false"
                                                            style={{ position: "relative", verticalAlign: "top" }}
                                                        />
                                                        <span
                                                            role="status"
                                                            aria-live="polite"
                                                            style={{
                                                                position: "absolute",
                                                                padding: 0,
                                                                border: 0,
                                                                height: 1,
                                                                width: 1,
                                                                marginBottom: "-1px",
                                                                marginRight: "-1px",
                                                                overflow: "hidden",
                                                                clip: "rect(0px, 0px, 0px, 0px)",
                                                                whiteSpace: "nowrap"
                                                            }}
                                                        />
                                                        <pre
                                                            aria-hidden="true"
                                                            style={{
                                                                position: "absolute",
                                                                visibility: "hidden",
                                                                whiteSpace: "pre",
                                                                fontFamily:
                                                                    'urania, "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif',
                                                                fontSize: 16,
                                                                fontStyle: "normal",
                                                                fontVariant: "normal",
                                                                fontWeight: 400,
                                                                wordSpacing: 0,
                                                                letterSpacing: 0,
                                                                textIndent: 0,
                                                                textRendering: "auto",
                                                                textTransform: "none"
                                                            }}
                                                        />
                                                        <div
                                                            role="listbox"
                                                            className="tt-menu"
                                                            id="ekyof2kxy38_listbox"
                                                            style={{
                                                                position: "absolute",
                                                                top: "100%",
                                                                left: 0,
                                                                zIndex: 100,
                                                                display: "none"
                                                            }}
                                                        >
                                                            <div
                                                                role="presentation"
                                                                className="tt-dataset tt-dataset-ekyof2kxy38_stations"
                                                            />
                                                        </div>
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <input
                                            type="submit"
                                            className="button expanded"
                                            id="search_primary"
                                            defaultValue="Search"
                                        />
                                        <div
                                            id="data-typeahead"
                                            data-url="/php/ajax_search.php?type=stations"
                                            data-type="stations"
                                        ></div>
                                    </form>
                                </div>
                                <div className="ad-wrapper">
                                    {/* Content Ignite Ad Unit Placeholder */}
                                    <div className="ad-unit rail long" id="rtt-ci-ss-rail" />
                                    {/* / Ad Unit Placeholder */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer>
                <hr />
                <div className="grid-container">
                    <div className="grid-x grid-y-margin">
                        <div className="small-6 medium-3 large-auto cell">
                            <h5>
                                <a href="https://www.realtimetrains.co.uk/search/">
                                    View The Trains
                                </a>
                            </h5>
                            <ul className="no-bullet">
                                <li>
                                    <a href="https://www.realtimetrains.co.uk/search/simple/">
                                        Simple
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.realtimetrains.co.uk/search/detailed/">
                                        Detailed
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="small-6 medium-3 large-auto cell">
                            <h5>
                                <a href="https://www.realtimetrains.co.uk/about/developer/">
                                    Data Feeds
                                </a>
                            </h5>
                            <ul className="no-bullet">
                                <li>
                                    <a href="https://api.rtt.io/">API Portal</a>
                                </li>
                                <li>
                                    <a href="https://www.realtimetrains.co.uk/about/developer/pull/docs/">
                                        API Documentation
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="small-6 medium-3 large-auto cell">
                            <h5>Help</h5>
                            <ul className="no-bullet">
                                <li>
                                    <a href="https://www.realtimetrains.co.uk/about/trackyourtrain/">
                                        Track Your Train
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.realtimetrains.co.uk/about/knowyourtrain/">
                                        Know Your Train
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="small-6 medium-3 large-auto cell">
                            <h5>
                                <a href="https://www.realtimetrains.co.uk/about/">About us</a>
                            </h5>
                            <ul className="no-bullet">
                                <li>
                                    <a href="https://www.realtimetrains.co.uk/about/faq/">FAQs</a>
                                </li>
                                <li>
                                    <a href="https://www.realtimetrains.co.uk/about/contact/">
                                        Contact us
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row align-middle">
                    <div className="medium-10 column">
                        <ul className="footer-inline">
                            <li>
                                <a href="https://www.realtimetrains.co.uk/legal/">
                                    Terms &amp; Conditions
                                </a>
                            </li>
                            <li>
                                <a href="https://www.realtimetrains.co.uk/legal/privacy/">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.realtimetrains.co.uk/search/simple/gb-nr:EUS#/"
                                >
                                    Privacy Settings
                                </a>
                            </li>
                            <li>
                                <a href="https://www.realtimetrains.co.uk/legal/cookies/">
                                    Cookie Policy
                                </a>
                            </li>
                            <li>
                                <a href="https://www.realtimetrains.co.uk/about/status/">
                                    Site Status
                                </a>
                            </li>
                            <li>
                                <a href="https://www.realtimetrains.co.uk/about/jobs/">Vacancies</a>
                            </li>
                        </ul>
                        <div className="copyright">
                            Realtime Trains, © 2011-2023 swlines Ltd, its partners and{" "}
                            <a href="https://www.realtimetrains.co.uk/about/sources/">
                                data sources
                            </a>
                            . All rights reserved.
                        </div>
                    </div>
                    <div className="medium-2 show-for-medium column icons text-right">
                        <a href="https://discord.gg/mh3Rm9g9rG">

                        </a>
                        <a href="https://www.facebook.com/realtimetrains">

                        </a>
                    </div>
                </div>
                <div className="ad-unit stickyspacer" />
            </footer>
            <iframe
                name="__tcfapiLocator"
                style={{ display: "none" }}
                src="./Realtime Trains _ Live Departures from London Euston_files/saved_resource.html"
            />
        </>


    )
}

export default DeparturesNoAimPage