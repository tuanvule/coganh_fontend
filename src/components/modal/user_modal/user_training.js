import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../context/appContext';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import Handle_chunk from '../handle_chunk';

export default function User_training({tasks, raw_tasks, your_tasks, is_owner, set_is_require_owner}) {
  const { history, user } = useContext(AppContext)
  const [chunk_index, set_chunk_index] = useState(0)
  const [your_tasks_chunk_index, set_your_tasks_chunk_index] = useState(0)
  
  const [un_public_tasks, set_un_public_tasks] = useState()
  const [UPT_chunk_index, set_UPT_chunk_index] = useState(0)
  const [is_reset_task, set_is_reset_task] = useState(0)

  const is_mobile = (window.innerWidth <= 600)

  function parseDateString(dateString) {
    let [datePart, timePart, period] = dateString.split(/[\s,]+/);
    // Tách phần ngày thành tháng, ngày và năm
    let [month, day, year] = datePart.split('/');
    // Tách phần thời gian thành giờ, phút và giây
    let [hour, minute, second] = timePart.split(':');
    
    hour = parseInt(hour, 10);
    if (period === 'PM' && hour !== 12) {
        hour += 12;
    } else if (period === 'AM' && hour === 12) {
        hour = 0;
    }

    // Định dạng giờ, phút và giây với 2 chữ số
    hour = String(hour).padStart(2, '0');
    minute = String(minute).padStart(2, '0');
    second = String(second).padStart(2, '0');

    // Tạo đối tượng Date với múi giờ Asia/Ho_Chi_Minh
    return new Date(year,month,day,hour,minute,second);
  }


  // Sắp xếp danh sách chuỗi thời gian

  function sort_task(tasks) {
    return tasks.sort((a, b) => {
      let dateA = parseDateString(a.submit_time);
      let dateB = parseDateString(b.submit_time);
      return (dateA - dateB);
    });
  }

  function handle_satus(status) {
    switch (status) {
      case "AC":
        return "text-blue-400  shadow-blue-400"
      case "WA":
        return "text-red-500  shadow-red-500"
      case "SE":
        return "text-red-500  shadow-red-500"
      case "TLE":
        return "shadow-white"
      default:
        return "shadow-white"
    }
  }

  function handle_delete(id) {
    if(!is_owner) {
      set_is_require_owner(true)
    }
    let is_delete = window.confirm("bạn có chắc muốn xóa")
    if (is_delete) {
      fetch(`https://coganh-cloud-827199215700.asia-southeast1.run.app/delete_task/${id}`, {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
        }
      })
        .then(res => res.json())
        .then(data => {
          set_is_reset_task(Math.random())
        })
        .catch(err => console.log(err))
    }
  }

  useEffect(() => {
    fetch(`https://coganh-cloud-827199215700.asia-southeast1.run.app/get_unpublic_user_tasks?username=${user.username}&page=${UPT_chunk_index}&size=9`)
    .then(res => res.json())
    .then(data => {
      set_un_public_tasks(data)
    })
    .catch(err => console.log(err))
  }, [is_reset_task, UPT_chunk_index])

  function handle_open_task(task) {
    if(is_mobile) {

      return
    }

    history(`/training/${task.id}`, {state: {task}})
  }

  console.log(your_tasks, chunk_index)
  // console.log(tasks, your_tasks)
  return (
    <div className="w-full ">
      <div className="statistical w-full flex lg:flex-row flex-col justify-between mb-5">
        <div className="statistical_bot lg:mt-0 mt-5 lg:w-[48%] w-full h-72 rounded-lg dark:bg-[#0b427e] bg-[#52b1ff] dark:text-white text-black py-5 grid grid-rows-5 grid-flow-col">
          <div className="statistical_title text-2xl font-bold px-5">CÁC BÀI ĐÃ ĐĂNG</div>
          <div className="grid grid-cols-2 row-span-4">
            <div className="flex flex-col items-center justify-center">
              {/* <p className="text-xl font-semibold mb-5">Số bot sở hữu</p> */}
              <div className="statistical_bot-circle w-32 h-32 rounded-full bg-[#202634] text-[#a0d8fa] flex flex-col justify-center items-center">
                <span className="text-2xl text-[#a0d8fa] font-bold">Số bài</span>
                <div className="text-5xl text-[#a0d8fa]">{your_tasks.length}</div>

              </div>
            </div>
            <div className="text-2xl flex flex-col justify-center">
              {/* <div>Thông số</div> */}
              <ul className="p-0">
                <li className="text-lg">
                  <span className=" font-bold text-xl">Số người thử thách: </span>{your_tasks.flat().reduce((cur, task) => cur + Object.keys(task).length, 0)}
                </li>
                <li className="text-lg">
                  <span className=" font-bold">Số submit : </span>{your_tasks.flat().reduce((cur, task) => cur + task.submission_count, 0)}
                </li>
                <li className="text-lg">
                  <span className="text-white font-bold">Số Accept : </span>{your_tasks.flat().reduce((cur, task) => cur + task.accepted_count, 0)}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="statistical_training lg:mt-0 mt-5 lg:w-[48%] w-full h-72 rounded-lg dark:bg-[#0b427e] bg-[#52b1ff] lg:p-5 flex flex-col">
          <div className="statistical_title text-2xl self-start font-bold lg:p-0 p-5">THÔNG SỐ CÁC BÀI ĐÃ LÀM</div>
          {raw_tasks[0] && (() => {
              const AC_count = raw_tasks.filter(h => h.status === "AC").length
              const WA_count = raw_tasks.filter(h => h.status === "WA").length
              const SE_count = raw_tasks.filter(h => h.status === "SE").length
              let dem = 0
              if(AC_count > 0) dem++
              if(WA_count > 0) dem++
              if(SE_count > 0) dem++
              
              return (<PieChart
                series={[
                {
                  arcLabel: (item) => `${item.value}`,
                  arcLabelMinAngle: 20,
                  data: [
                    { id: 0, value: AC_count, label: 'AC', color: "#1F81C1" },
                    { id: 1, value: WA_count, label: 'WA', color: "#CD151A" },
                    { id: 2, value: SE_count, label: 'SE', color: "red" },
                  ],
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  faded: { innerRadius: 10, additionalRadius: -10, color: 'gray' },
                  innerRadius: 30,
                  outerRadius: 100,
                  paddingAngle: dem === 3 ? 5 : 0,
                  cornerRadius: 5,
                  startAngle: 0,
                  endAngle: 360,
                  cx: 150,
                  cy: 150,
                },
              ]}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fill: 'white',
                  font: 'bold 20px sans-serif',
                },
                ["& .MuiChartsLegend-series text"]: {
                  fill: "white !important",
                  font: 'bold 20px sans-serif !important',
                }
              }}
              width={400}
              height={300}
            />)
            })()}
        </div>
      </div>
    {is_owner && <>

      <p className="text-3xl font-bold mb-5">Chờ được duyệt</p>
      <table class="w-full table-auto border-collapse border border-slate-500">
          <thead>
            <tr>
              <th className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1 text-left"></th>
              <th className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1 text-left">Task</th>
              <th className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1 text-left">Author</th>
              <th className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1 text-left">Submissions</th>
              <th className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1 text-left">Challenger</th>
              <th className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1 text-left"></th>
              <th className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {is_owner && un_public_tasks && un_public_tasks.map((task, i) => 
              <tr key={i}>
                <td className={`border text-center border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1 font-bold text-lg`}>{i+1}</td>
                <td onClick={() => handle_open_task(task)} className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1 font-semibold cursor-pointer dark:hover:text-slate-200 hover:text-slate-600">{task.task_name}</td>
                <td className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1">{task.author}</td>
                <td className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1">{task.submission_count}</td>
                <td className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1">{Object.keys(task.challenger).length}</td>
                <td onClick={() => history(`/create_task?is_update=true`,{
                                state: {
                                    task
                                }
                            })} className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1 dark:text-slate-200 text-black text-xl text-center cursor-pointer hover:brightness-90"><i class="fa-solid fa-pen-to-square"></i></td>
                <td onClick={() => handle_delete(task.id)} className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1 text-red-400 text-xl text-center cursor-pointer hover:brightness-90"><i class="fa-solid fa-circle-xmark"></i></td>
            </tr>
            )}
          </tbody>
        </table>
    </>}     

      <p className="text-3xl font-bold my-5">Bài rèn luyện đã đăng</p>

      <table class="w-full table-auto border-collapse border border-slate-500 mb-5">
        <thead>
          <tr>
            <th className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1 text-left">Task</th>
            <th className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1 text-left">Submission</th>
            <th className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1 text-left">Acceptances</th>
            <th className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1 text-left">difficult</th>
            <th className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1 text-left">Challenger</th>
            <th className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {your_tasks[your_tasks_chunk_index] && your_tasks[your_tasks_chunk_index].map((task, i) =>                 
          <tr key={i}>
            <td onClick={() => history(`/training/${task.id}`, {state: {task: task}})} className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1 font-semibold cursor-pointer dark:hover:text-slate-200 hover:text-slate-600">{task.task_name}</td>
            <td className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1">{task.submission_count}</td>
            <td className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1">{task.accepted_count}</td>
            <td className={`border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1 task_difficult [text-shadow:0px_0px_12px_var(--tw-shadow-color)] shadow-white ${task.tag.difficult}`}>{task.tag.difficult}</td>
            <td className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1">{Object.keys(task.challenger).length}</td>
            <td onClick={() => history(`/create_task?is_update=true`,{state: {task}})} className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1 dark:text-slate-200 text-black text-xl text-center cursor-pointer hover:brightness-90"><i class="fa-solid fa-pen-to-square"></i></td>
          </tr>
          )}
        </tbody>
      </table>
      {your_tasks.length > 1 && <Handle_chunk chunk_index={your_tasks_chunk_index} set_chunk_index={set_your_tasks_chunk_index} max_chunk={your_tasks.length - 1}/>}

      <p className="text-3xl font-bold my-5">Lịch sử submit</p>
      <table class="w-full table-auto border-collapse border border-slate-500">
        <thead>
          <tr>
            <th className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1 text-left">Status</th>
            <th className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1 text-left">Task</th>
            <th className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1 text-left">Time Submitted</th>
            <th className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1 text-left">Runtime</th>
          </tr>
        </thead>
        <tbody>
          {tasks[chunk_index] && sort_task(tasks[chunk_index]).reverse().map((task, i) => 
            <tr key={i}>
              <td className={`border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1 font-bold text-lg [text-shadow:0px_0px_12px_var(--tw-shadow-color)] ${handle_satus(task.status)}`}>{task.status}</td>
              <td onClick={() => handle_open_task(task)} className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1 font-semibold cursor-pointer dark:hover:text-slate-200 hover:text-slate-600">{task.task_name}</td>
              <td className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1">{task.submit_time}</td>
              <td className="border border-slate-600 dark:bg-[#111c2c] bg-slate-200 px-1 py-1">{task.run_time.toFixed(2)} ms</td>
          </tr>
          )}
        </tbody>
      </table>
      {/* {console.log(Math.ceil(raw_tasks.length / 40) + 1)} */}
      {tasks.length > 1 && <Handle_chunk chunk_index={chunk_index} set_chunk_index={set_chunk_index} max_chunk={Math.ceil(raw_tasks.length / 40) - 1}/>}
    </div>
  )
}
