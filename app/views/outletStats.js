import _ from 'lodash'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import TopBar from '../components/topbar'
import OutletColumn from '../components/outletPurchases/outletColumn.js'

class OutletStats extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            outlets: [],
        }


    }

    componentDidMount() {
        $.ajax({
            url: '/api/outlet/get',
            type: 'GET',
            data: {
                id: '559c01adbd0ecfff74e1a334'
            },
            dataType: 'json',
            success: (response, status, xhr) => {
                if(!response.err) {
                    this.setState({
                        outlets: [response.data]
                    })
                }
            }
        });      
    }


    loadOutlets() {

    }


    render() {

        var columns = this.state.outlets.map((outlet, i) => {
            return <OutletColumn 
                        outlet={outlet}
                        key={i} />
        });

        return (
            <App user={this.props.user}>
                <TopBar 
                    title="Outlet Purchases">

                </TopBar>

                <div className="outletStats">
                    {columns}
                </div>
            </App>
        )
    }
}

ReactDOM.render(
  <OutletStats
    user={window.__initialProps__.user} />,
    document.getElementById('app')
);
