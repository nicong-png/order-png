import ajaxs from '@/utils/request';
import { Promise } from 'core-js';
import { rejects } from 'assert';

const searchId = '0' // 获取数据字典数据



export function selectOption(name, childID) {
  return new Promise((resolve, reject) => {
    ajaxs.get('/console/v1/dictionary/list',{parentId:searchId}).then(res => { // 获取对应的子字典id
      // console.log(res)
      for(var i in res.content) {
        if(res.content[i].name === name) {
          childID = res.content[i].id
        }
      }
      ajaxs.get('/console/v1/dictionary/list',{parentId:childID}).then(res => { // 获取子字典列表
       resolve(res.content) 
      }).catch( err => reject(err) )
    }).catch( err => reject(err) )
  })
}