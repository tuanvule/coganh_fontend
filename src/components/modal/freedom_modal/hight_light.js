import React from 'react';
import remove_red from "../../../static/img/red_remove_tracker.png"
import remove_blue from "../../../static/img/blue_remove_tracker.png"

const Hight_light = ({ id, hight_light, remove_animaiton }) => {

  return (
    <div id={`FD_hight_light_${id}`} className={`FD_hight_light -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px] ${hight_light.is_HL && "border-green-500 border-[6px]"} rounded-full z-[1000px] overflow-hidden`}>
      <img src={remove_animaiton.side !== 0 && (remove_animaiton.side === 1 ? remove_red : remove_blue)} className={`object-cover border-none ${remove_animaiton.side === 0 && "hidden"} animate-deleteChessAnimation`}/>
    </div>
  );
};

export default Hight_light;
