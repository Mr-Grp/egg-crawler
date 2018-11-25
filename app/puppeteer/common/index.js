//休眠
const sleep = (delay) => {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          try {
              resolve(1)
          } catch (e) {
              reject(0)
          }
      }, delay)
  })
}

//滚动
const scroll = async ( page, { step = 1080, maxHeight = 20000 } ) => {
  let scrollEnable = true
  while (scrollEnable) {
    scrollEnable = await page.evaluate((step, maxHeight) => {

      if (document.body) {
          let scrollEnableFlag = true
          let scrollTop = document.scrollingElement.scrollTop;
          document.scrollingElement.scrollTop = scrollTop + step;

          if(scrollTop === document.scrollingElement.scrollTop){
            scrollEnableFlag = false;
          }

          if(document.scrollingElement.scrollTop > maxHeight ) {
            scrollEnableFlag = false;
          }

          return scrollEnableFlag
      }

    }, step, maxHeight);
    await sleep(800);
  }
}

//查看进度
const formatProgress = (current, TOTAL_PAGE) => { 
  let percent = (current / TOTAL_PAGE) * 100
  let done = ~~(current / TOTAL_PAGE * 40)
  let left = 40 - done
  let str = `当前进度：[${''.padStart(done, '=')}${''.padStart(left, '-')}]  ${percent}%`
  return str
 }


exports.sleep = sleep
exports.scroll = scroll
exports.formatProgress = formatProgress