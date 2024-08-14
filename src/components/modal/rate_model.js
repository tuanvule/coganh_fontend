
import brilliant_icon from "../../static/img/brilliant_icon.png"
import bad_icon from "../../static/img/bad_icon.png"
import good_icon from "../../static/img/good_icon.png"
import chessboard1 from "../../static/img/chessboard1.png"
import { useEffect } from "react"
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

export default function CreateRateModel({ data, is_loading }) {
    useEffect(() => {
        if (!is_loading) {
            let doom_main = $(".RM_rate")
            let doom_main_$ = doom_main.querySelector.bind(doom_main)
            let doom_main_$$ = doom_main.querySelectorAll.bind(doom_main)
            let doom_img_loader = doom_main_$(".RM_img_list")
            let doom_img_item = null
            let arrow_left = doom_main_$(".RM_arrow_left")
            let arrow_right = doom_main_$(".RM_arrow_right")
            let doom_rate_item = null
            let doom_img_counter = doom_main_$(".RM_counter")
            let doom_player_you = doom_main_$(".RM_player.RM_you .RM_content")
            let doom_player_enemy = doom_main_$(".RM_player.RM_enemy .RM_content")
            let cur_img = 0
            let move_count = 0

            function get_rate_list_detail() {
                return doom_main_$(".RM_rate_list .RM_detail")
            }

            function get_rate_item(index) {
                const rate_item = doom_main_$$(".RM_rate_item")
                if (index) {
                    return rate_item[index]
                }
                return rate_item
            }

            function render(side) {
                const rate_list_detail = get_rate_list_detail()
                let type_count = [
                    {
                        "Tốt nhất": 0,
                        "Tốt": 0,
                        "Bình thường": 0,
                        "Tệ": 0,
                    },
                    {
                        "Tốt nhất": 0,
                        "Tốt": 0,
                        "Bình thường": 0,
                        "Tệ": 0,
                    }
                ]

                move_count = data.length

                doom_main_$(".RM_move_count").innerHTML = `MOVE: ${move_count}`
                if (side === 1) {
                    doom_player_you.classList.add("RM_blue")
                    doom_player_enemy.classList.add("RM_red")
                } else {
                    doom_player_enemy.classList.add("RM_blue")
                    doom_player_you.classList.add("RM_red")
                }

                data.forEach((rate, i) => {
                    let res = {
                        type: "",
                        icon: ""
                    }

                    type_count[i % 2 === 0 ? 0 : 1][rate.type]++
                    if (rate.type === "Tốt nhất") {
                        res.type = rate.type
                        res.icon = `<img class="RM_rate_item-you_img" src=${brilliant_icon} alt="">`
                    } else if (rate.type === "Tệ") {
                        res.icon = `<img class="RM_rate_item-you_img" src=${bad_icon} alt="">`
                        res.type = rate.type
                    } else if (rate.type === "Tốt") {
                        res.icon = `<img class="RM_rate_item-you_img" src=${good_icon} alt="">`
                        res.type = rate.type
                    }

                    if (side === 1) {
                        rate_list_detail.innerHTML += `
                    <li class="RM_rate_item">
                        <div class="RM_rate_item-you">${i % 2 === 0 ? res.icon + res.type : ""}</div>
                        <div class="RM_rate_item-move">${rate.move.sellected_pos + " => " + rate.move.new_pos}</div>
                        <div class="RM_rate_item-opp">${i % 2 !== 0 ? res.type + res.icon : ""}</div>
                    </li>
                `
                    } else {
                        rate_list_detail.innerHTML += `
                    <li class="RM_rate_item">
                        <div class="RM_rate_item-you">${i % 2 !== 0 ? res.icon + res.type : ""}</div>
                        <div class="RM_rate_item-move">${rate.move.sellected_pos + " => " + rate.move.new_pos}</div>
                        <div class="RM_rate_item-opp">${i % 2 === 0 ? res.type + res.icon : ""}</div>
                    </li>
                `
                    }

                    doom_img_loader.innerHTML += `
                    <li style="display: none;" class="RM_img_item RM_default"><img src=${rate.img_url} alt=""></li>
                `
                });

                const overview = doom_main_$(".RM_overview")

                if (side === -1) type_count = type_count.reverse()

                for (let i = 0; i < 4; i++) {
                    if (i === 0) {
                        overview.innerHTML += `
                    <li class="RM_excellent_count">
                        <div class="RM_excellent_count-you">${type_count[0]["Tốt nhất"]}</div>
                        <div class="RM_excellent_count-title RM_excellent">TỐT NHẤT</div>
                        <div class="RM_excellent_count-opp">${type_count[1]["Tốt nhất"]}</div>
                    </li>
                `
                    }
                    if (i === 1) {
                        overview.innerHTML += `
                    <li class="RM_excellent_count">
                        <div class="RM_excellent_count-you">${type_count[0]["Tốt"]}</div>
                        <div class="RM_excellent_count-title RM_good">TỐT</div>
                        <div class="RM_excellent_count-opp">${type_count[1]["Tốt"]}</div>
                    </li>
                `
                    }
                    if (i === 2) {
                        overview.innerHTML += `
                    <li class="RM_excellent_count">
                        <div class="RM_excellent_count-you">${type_count[0]["Bình thường"]}</div>
                        <div class="RM_excellent_count-title RM_normal">BÌNH THƯỜNG</div>
                        <div class="RM_excellent_count-opp">${type_count[1]["Bình thường"]}</div>
                    </li>
                `
                    }
                    if (i === 3) {
                        overview.innerHTML += `
                    <li class="RM_excellent_count">
                        <div class="RM_excellent_count-you">${type_count[0]["Tệ"]}</div>
                        <div class="RM_excellent_count-title RM_bad">TỆ</div>
                        <div class="RM_excellent_count-opp">${type_count[1]["Tệ"]}</div>
                    </li>
                `
                    }
                }
                doom_img_item = doom_main_$$(".RM_img_item")
                doom_rate_item = doom_main_$$(".RM_rate_item")
            }

            function toggle_rate(preI, newI) {
                doom_rate_item[preI - 1]?.classList.toggle("RM_sellected")
                doom_rate_item[newI - 1]?.classList.toggle("RM_sellected")
                scrollToView(doom_rate_item[newI - 1])
            }

            function tonggle_img(preI, newI) {
                if (newI < 0) {
                    newI = doom_img_item.length - 1
                    cur_img = newI + 1
                    tonggle_img(preI, newI)
                    return
                } else if (newI > doom_img_item.length - 1) {
                    newI = 0
                    cur_img = newI - 1
                    tonggle_img(preI, newI)
                    return
                }
                if (newI >= 0 && newI <= doom_img_item.length - 1) {
                    // console.log(doom_rate_item)
                    doom_img_counter.innerHTML = newI
                    doom_img_item[preI].style.display = "none"
                    doom_img_item[newI].style.display = "block"
                    toggle_rate(preI, newI)
                }
            }

            function scrollToView(element) {
                if (!element) return
                setTimeout(() => {
                    element.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                    })
                }, 200)
            }

            function handle_event() {
                arrow_left.onclick = () => {
                    tonggle_img(cur_img, cur_img - 1)
                    cur_img--
                }
                arrow_right.onclick = () => {
                    tonggle_img(cur_img, cur_img + 1)
                    cur_img++

                }
                doom_rate_item.forEach((item, i) => {
                    item.onclick = () => {
                        tonggle_img(cur_img, i + 1)
                        cur_img = i + 1
                    }
                })
                document.onkeyup = (e) => {
                    if (e.code === "ArrowUp" || e.code === "KeyW") {
                        tonggle_img(cur_img, cur_img - 1)
                        cur_img--
                    } else if (e.code === "ArrowDown" || e.code === "KeyS") {
                        tonggle_img(cur_img, cur_img + 1)
                        cur_img++
                    }
                }
            }

            function start(side = 1) {
                render(side)
                handle_event()
            }

            start()
        }
    }, [data, is_loading])
    return (
        <div className="RM_rate lg:scale-100 sm:scale-50">
            <div className="RM_game_display">
                {!is_loading ?
                    <>
                        <i className="fa-solid fa-angle-left RM_arrow_left" />
                        <div className="RM_img_main">
                            <ul className="RM_img_list p-0 m-0">
                                <li className="RM_img_item RM_default">
                                    <img src={chessboard1} alt="" />
                                </li>
                            </ul>
                            <div className="RM_counter">0</div>
                        </div>
                        <i className="fa-solid fa-angle-right RM_arrow_right" />
                    </>
                    :
                    <div className="RM_loader">
                        <div className="RM_loading" />
                    </div>
                }
            </div>
            <div className="RM_game_rate">
                {!is_loading ?
                    <div className="RM_rate_list">
                        <ul className="RM_overview p-0">
                            <div className="RM_header">
                                <div className="RM_player RM_you">
                                    <div className="RM_content">Bạn</div>
                                </div>
                                <div className="RM_move_count">MOVES: 20</div>
                                <div className="RM_player RM_enemy">
                                    <div className="RM_content">Đối thủ</div>
                                </div>
                            </div>
                        </ul>
                        <div className="RM_spacing" />
                        <ul className="RM_detail p-0"></ul>
                    </div>
                    :
                    <div className="RM_ske_loading">
                        <ul className="RM_ske_loading-overview p-0">
                            <li />
                            <li />
                            <li />
                            <li />
                        </ul>
                        <div className="RM_spacing" />
                        <ul className="RM_ske_loading-detail p-0">
                            <li />
                            <li />
                            <li />
                        </ul>
                    </div>
                }
            </div>
        </div>)
}