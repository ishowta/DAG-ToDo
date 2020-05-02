import React from 'react'
import PropTypes from 'prop-types'
import { findGetParameter } from "../util";

const Viewer = ({ todo }) => (
    <div>
        {todo !== undefined &&
            <div style={{
                padding: "0.5em 1em",
                margin: "2em 0",
                fontWeight: "bold",
                color: "#6091d3",
                background: "#FFF",
                border: "solid 3px #6091d3",
                borderRadius: "10px",
            }}>
                {todo.text}
                <a href={"https://scrapbox.io/" + findGetParameter("room") + "/" + todo.text}>
                    (→ノート)
                </a>
            </div>
        }
    </div>
)

Viewer.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired,
}

export default Viewer
