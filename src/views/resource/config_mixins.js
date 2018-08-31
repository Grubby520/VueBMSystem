import CountUp from '@/assets/js/lib/countUp-1.9.3.js'
export default{
  methods:{
    addNumAnimation (id, value) {
      let num = parseFloat(value),
        numStr = String(num)
      if (!isNaN(num)) {
        let decNumber = 0
        if (numStr.split('.')[1]) {
          decNumber = numStr.split('.')[1].length > 2 ? 2 : numStr.split('.')[1].length
        }
        let countUpObj = new CountUp(id, 0, num, decNumber, 2.5)
        countUpObj.start()
        CountUp.TimerIdsManeger.timerIdsMap[id] = countUpObj
      }
    },
    clearTimerIdS () {
      for(var i = 0; i < arguments.length; i++){
        CountUp.TimerIdsManeger.clearTimerId(arguments[i])
        $('#'+arguments[i]).text('?')
      }
    }
  }

}