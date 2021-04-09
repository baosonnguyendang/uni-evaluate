import React from 'react';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Evaluate() {
  return (
    <div>
      <form>
        <table className="table table-responsive">
          <thead>
            <tr>
              <th>Courier</th>
              <th>Service</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="radio">
                  <label><input type="radio" id='regular' name="optradio" /></label>
                </div>
              </td>
              <td>
                <div className="radiotext">
                  <label for='regular'>Regular ship</label>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="radio">
                  <label><input type="radio" id='express' name="optradio" /></label>
                </div>
              </td>
              <td>
                <div className="radiotext">
                  <label for='express'>Express Shipping</label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}