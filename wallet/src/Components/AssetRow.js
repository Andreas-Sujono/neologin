import React from 'react';
import Grid from '@material-ui/core/Grid';
import neologin from 'neologin';
import Send from '@material-ui/icons/Send';
import Collapse from '@material-ui/core/Collapse';
import { withTranslation } from 'react-i18next';
import './assetrow.css'

const ASSETS = {
    'NEO':
    {
        name: 'NEO',
        icon: <path d="M207.288 35.521L132.161 0 21.651 39.9l75.127 35.521 110.51-39.9zm-77.066 42.211v73.601l78.278 36.982V49.471l-78.278 28.261zM94.839 89.441V227L18.5 190.991V53.348"></path>
    },
    'GAS':
    {
        name: 'GAS',
        icon: <path d="M207.288 35.521L132.161 0 21.651 39.9l75.127 35.521 110.51-39.9zm-77.066 42.211v73.601l78.278 36.982V49.471l-78.278 28.261zM94.839 89.441V227L18.5 190.991V53.348"></path>
    }
}

class AssetRow extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            toAddress: '',
            amount: '',
            rotate: false
        };
    }

    unCollapse = () => {
        this.setState({ open: !this.state.open, rotate: !this.state.rotate })
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        })
    }

    send = () => {
        neologin.send({
            fromAddress: this.props.address,
            toAddress: this.state.toAddress,
            asset: this.props.symbol,
            amount: this.state.amount,
            network: this.props.network,
            broadcastOverride: false,
        })
            .then(({ txid, nodeUrl }) => {
                this.setState({ open: false, rotate: false })
                console.log('Send transaction success!');
                console.log('Transaction ID: ' + txid);
                console.log('RPC node URL: ' + nodeUrl);
                this.props.getBalance()
            })
            .catch(({ type, description, data }) => {
                switch (type) {
                    case "NO_PROVIDER":
                        console.log('No provider available.');
                        break;
                    case "SEND_ERROR":
                        console.log('There was an error when broadcasting this transaction to the network.');
                        break;
                    case "MALFORMED_INPUT":
                        console.log('The receiver address provided is not valid.');
                        break;
                    case "CANCELED":
                        console.log('The user has canceled this transaction.');
                        break;
                    case "INSUFFICIENT_FUNDS":
                        console.log('The user has insufficient funds to execute this transaction.');
                        break;
                    default:
                        break;
                }
            });

    }

    render() {
        const t = this.props.t
        return (
			ASSETS[this.props.symbol] === undefined ? null :
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="flex-start"
            >
                <Grid item style={{ width: '100%' }}>
                    <Grid container direction="row" justify="space-between" alignItems="center" style={{
                        background: '#2d2d37',
                        padding: '8px 15px',
                        borderRadius: this.state.open ? '5px 5px 0px 0px' : '5px',
                        transitionDelay: !this.state.open ? '281ms' : '0ms'
                    }}
                    >
                        <Grid item>
                            <div className="badge">
                                <div className="crypto">
                                    <svg width="20" height="20" viewBox="0 0 226 226">
                                        {ASSETS[this.props.symbol].icon}
                                    </svg>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs style={{ paddingLeft: '15px' }}>
                            <span style={{ display: 'block' }}>{ASSETS[this.props.symbol].name}</span>
                        </Grid>
                        <Grid item>{this.props.amount} {this.props.symbol}</Grid>
                        <Grid item style={{ marginLeft: '1rem' }}>
                            <Send
                                onClick={() => {
                                    this.unCollapse()
                                }}
                                style={!this.state.rotate ?
                                    {
                                        cursor: 'pointer',
                                        alignItems: 'center',
                                        display: 'flex',
                                        WebkitTransition: '-webkit-transform .2s',
                                        msTransition: '-ms-transform .2s',
                                        transition: 'transform .2s',
                                        justifyContent: 'center',
                                    } : {
                                        justifyContent: 'center',
                                        transform: 'rotate(90deg)',
                                        msTransform: 'rotate(90deg)',
                                        WebkitTransform: 'rotate(90deg)',
                                        WebkitTransition: '-webkit-transform .2s',
                                        msTransition: '-ms-transform .2s',
                                        transition: 'transform .2s',
                                        cursor: 'pointer',
                                        alignItems: 'center',
                                        display: 'flex',
                                    }} />
                        </Grid>
                    </Grid>
                </Grid>
                <Collapse in={this.state.open} timeout="auto" style={{ width: '100%' }}>
                    <Grid item xs style={{ width: '100%' }}>
                        <Grid container direction="column" style={{
                            background: '#2d2d37',
                            padding: '8px 15px',
                            alignItems: 'center'
                        }}>
                            <Grid item>
                                <p className="label" style={{ margin: 0 }}>{t("subtittle_sendAsset")}</p>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item style={{ width: '100%' }}>
                        <Grid container direction={this.props.isMobile ? "column" : "row"} style={{
                            background: '#2d2d37',
                            padding: '8px 15px'
                        }}>
                            <Grid item xs>
                                <label className="label" htmlFor="toAddress">{t("label_address")}</label>
                                <input type="text" name="toAddress" id="toAddress" onChange={this.handleInputChange} />
                            </Grid>
                            <Grid item style={{ width: '1rem', height: this.props.isMobile ? '1rem' : '1px' }}>
                            </Grid>
                            <Grid item>
                                <label className="label" htmlFor="amount">{t("label_amount")}</label>
                                <input type="text" name="amount" id="amount" onChange={this.handleInputChange} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item style={{ width: '100%' }}>
                        <Grid container
                            direction="row"
                            justify="flex-end"
                            alignItems="center" style={{
                                background: '#2d2d37',
                                padding: '8px 15px',
                                borderRadius: '0px 0px 5px 5px'
                            }}>
                            <Grid item style={{ marginBottom: '0.5rem', width: this.props.isMobile ? '100%' : 'unset' }}>
                                <input style={{ width: this.props.isMobile ? '100%' : 'unset' }} type="submit" value={t("button_send")} className="primary" onClick={this.send} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Collapse>
            </Grid >
        )
    }
}

export default withTranslation()(AssetRow)
