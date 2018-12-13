let question = [
    [
      {
        atype: 3,  // 这个就是 第一关的 左 袋子里面装的 糖果图片 就是你的文件名字 减去 1
        btype: 2,   // 这个就是 第一关的 左 袋子里面装的 糖果图片 就是你的文件名字 减去 1
        acount: 4,  // 这个就是 第一关的 右 袋子里面装的 糖果图片 数量 不能小于 1 大于 5  
        bcount: 2,  // 这个就是 第一关的 右 袋子里面装的 糖果图片 数量 不能小于 1 大于 5  
        typearr: [0,1,3,2],  // 这个就是 关卡上面  需要显示几个类型的 糖果 你的图片名字 减去1
        status: 0 // 这个不用管
      },
    {
      atype: 6,
      btype: 4,
      acount: 3,
      bcount: 5,
      typearr: [4,5,6,7],
      status: 0
    },
    {
      atype: 8,
      btype: 10,
      acount: 3,
      bcount: 3,
      typearr: [8,9,5,10],
      status: 0
    },
    {
      atype: 8,
      btype: 11,
      acount: 2,
      bcount: 2,
      typearr: [8,9,11,12],
      status: 0
    },
    {
      atype: 14,
      btype: 13,
      acount: 4,
      bcount: 2,
      typearr: [14,6,13,9],
      status: 0
    },
  ],
]

const mainHousePoint = [-98, -865, -1618, -2414, -3185]

export default { question, mainHousePoint }