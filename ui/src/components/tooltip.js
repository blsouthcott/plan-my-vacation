import { AiFillInfoCircle } from 'react-icons/ai';
import { Tooltip } from 'react-tooltip';

const tooltipStyle = {
  zIndex: 999,
  backgroundColor: "black",
  width: "200px",
  borderRadius: "5px",
  padding: "10px",
}

const InfoTooltip = ({ id, text }) => (
  <>
    <AiFillInfoCircle id={id} data-tooltip-content={text} />
    <Tooltip
        style={tooltipStyle}
        anchorId={id}
        place="right" 
        delayShow="300" 
        delayHide="100"/>
  </>
)

export default InfoTooltip;
