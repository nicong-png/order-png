
const togo = {
    togo(url, data) {
        url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)

        uni.navigateTo({
            url,
            animationType: "pop-in",
            animationDuration: 200
        })
    },
    //当前时间
    getNewTime(val, date, type) {
        let time
        if (val) {
          time = new Date(val)
        } else {
          time = new Date()
        }
        let y = time.getFullYear()
        let m = time.getMonth() + 1
        let d = time.getDate()
        let h = time.getHours()
        let min = time.getMinutes()
        let s = time.getSeconds()
        if (type) {
          return y + '年' + m + '月' + d + '日'
        } else {
          return date ?
          (y<10?'0'+y:y) + '-' + (m<10?'0'+m:m) + '-' + (d<10?'0'+d:d) :
            (y<10?'0'+y:y) + '-' + (m<10?'0'+m:m) + '-' + (d<10?'0'+d:d) + ' ' + (h<10?'0'+h:h) + ':' + (min<10?'0'+min:min) + ':' + (s<10?'0'+s:s)
        }
    
      },
      //提示
      totast(text){
        wx.showToast({
          title: text,
          icon: 'none',
          duration: 1000
          })
      },
        // 强复制
  superCopy: obj => {
    return JSON.parse(JSON.stringify(obj))
  },
 // 下载文件
   ExportCSV(res) {
      let blob = new Blob([res.data], {
		 type: "application/vnd.ms-excel;charset=utf-8",
	   });
	   let url = window.URL.createObjectURL(blob);
	   let aLink = document.createElement("a");
	   aLink.style.display = "none";
	   aLink.href = url;
	   aLink.setAttribute(
		 "download",
		 startTimeA + "至" + _this.endTimeA + "订单.xls"
	   );
	   document.body.appendChild(aLink);
	   aLink.click();
	   document.body.removeChild(aLink);
	   window.URL.revokeObjectURL(url);
   },  
     param(data) {
       let url = ''
       for (var k in data) {
           let value = data[k] !== undefined ? data[k] : ''
           url += '&' + k + '=' + encodeURIComponent(value)
       }
       return url ? url.substring(1) : ''
   }
}



export default togo;