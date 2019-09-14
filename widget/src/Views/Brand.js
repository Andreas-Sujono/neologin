import React from 'react';
import Grid from '@material-ui/core/Grid';

import './styles.css'

function Brand({ closeWidget }) {
  return (
    <div>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={{ textAlign: 'center', padding: '8px 0', background: '#fff' }}
      >
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          {/* <img src={logo2} style={{ height: '1em' }} /> */}
          <span className="brand" onClick={() => window.open('https://neologin.io')}>NEO LOGIN</span>
        </Grid>
        <Grid item xs={1}>
          <Grid
            container
            justify="flex-start"
            alignItems="flex-start"
          >
            <Grid item>
              <span className='closeButton' onClick={() => closeWidget()}>
                ✖
              </span>
            </Grid>
          </Grid>
        </Grid>
      </Grid >
    </div>
  );
}

export default Brand;
