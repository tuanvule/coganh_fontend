const alignWidth = window.innerWidth / 2
const alignHeight = window.innerHeight

const branchEdgeStyle = {
    stroke: '#007BFF', // Màu của cạnh
    strokeWidth: 2, // Độ dày đường kẻ
    strokeDasharray: '3 3', // Định nghĩa đường đứt (5px nét, 5px khoảng trống)
}
  
export const edges = [
    { id: '1-2', source: '1', sourceHandle: 'sB', target: 'play_chess', targetHandle: "tT",  },
    { id: 'play_chess-1', source: 'play_chess', sourceHandle: 'sR', target: 'play_chess_1', targetHandle: "tL", style: branchEdgeStyle },
    { id: 'play_chess-2', source: 'play_chess', sourceHandle: 'sR', target: 'play_chess_2', targetHandle: "tL", style: branchEdgeStyle },
    { id: 'play_chess-3', source: 'play_chess', sourceHandle: 'sR', target: 'play_chess_3', targetHandle: "tL", style: branchEdgeStyle },
    { id: '2-3', source: 'play_chess', sourceHandle: 'sB', target: 'basic_python', targetHandle: "tT" },
    { id: 'basic_python-1', source: 'basic_python', sourceHandle: 'sL', target: 'basic_python_1', targetHandle: "tR" },
    { id: 'basic_python-2', source: 'basic_python', sourceHandle: 'sL', target: 'basic_python_2', targetHandle: "tR" },
    { id: 'basic_python-3', source: 'basic_python', sourceHandle: 'sL', target: 'basic_python_3', targetHandle: "tR" },
    { id: 'basic_python-4', source: 'basic_python', sourceHandle: 'sL', target: 'basic_python_4', targetHandle: "tR" },
    { id: 'basic_python-5', source: 'basic_python', sourceHandle: 'sL', target: 'basic_python_5', targetHandle: "tR" },
];
  
const commonStyle = {
    padding: 10,
    borderRadius: 6,
    border: "2px solid gray"
}

const mainStyle = {
    background: "white",
    ...commonStyle
}

const branchStyle = {
    background: "#007BFF",
    color: "white",
    ...commonStyle
}

const main_node_data = [
    {
        id: '1',
        type: 'custom',
        position: { x: 0 + alignWidth, y: 0 },
        data: { label: 'coganh', style: mainStyle, source_pos: ["b"], link: "/menu"},
    },
]

const play_chess_data = [
    {
        id: 'play_chess',
        type: 'custom',
        position: { x: 0 + alignWidth, y: 100 },
        data: { label: 'Play chess', style: mainStyle, source_pos: ["r", "b"], target_pos: ["t"], link: "/human_bot" },
    },
    {
        id: 'play_chess_1',
        type: 'custom',
        position: { x: 300 + alignWidth, y: 20 },
        data: { label: 'chế độ truyền thống', style: branchStyle, target_pos: ["l"], link: "/human_bot" },
    },
    {
        id: 'play_chess_2',
        type: 'custom',
        position: { x: 300 + alignWidth, y: 80 },
        data: { label: 'Bot level 1 - Master', style: branchStyle, target_pos: ["l"], link: "/human_bot" },
    },
    {
        id: 'play_chess_3',
        type: 'custom',
        position: { x: 300 + alignWidth, y: 140 },
        data: { label: 'Đánh giá nước đi', style: branchStyle, target_pos: ["l"], link: "/human_bot" },
    },
]

const basic_python_data = [
    {
        id: 'basic_python',
        type: 'custom',
        position: { x: -40 + alignWidth, y: 200 },
        data: { label: 'Python cơ bản', style: mainStyle, source_pos: ["l"], target_pos: ["t"] },
    },
    {
        id: 'basic_python_1',
        type: 'custom',
        position: { x: -300 + alignWidth, y: 100 },
        data: { label: 'Kiểu dữ liệu', style: mainStyle, target_pos: ["r"] },
    },   
    {
        id: 'basic_python_2',
        type: 'custom',
        position: { x: -350 + alignWidth, y: 160 },
        data: { label: 'Toán tử', style: mainStyle, target_pos: ["r"] },
    },
    {
        id: 'basic_python_3',
        type: 'custom',
        position: { x: -350 + alignWidth, y: 220 },
        data: { label: '', style: mainStyle, target_pos: ["r"] },
    },
    {
        id: 'basic_python_4',
        type: 'custom',
        position: { x: -350 + alignWidth, y: 280 },
        data: { label: 'Python cơ bản', style: mainStyle, target_pos: ["r"] },
    },
    {
        id: 'basic_python_5',
        type: 'custom',
        position: { x: -350 + alignWidth, y: 340 },
        data: { label: 'Python cơ bản', style: mainStyle, target_pos: ["r"] },
    },
]
  
export const nodes = [
    ...main_node_data,
    ...play_chess_data,
    ...basic_python_data,
];
