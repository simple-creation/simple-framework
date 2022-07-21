import Block5 from '../../block5';

const DataSource = {
  
    title: {
      main: "选择",
      subTitle: "在这里用一段话介绍服务的案例情况",
    },
    itemsData: [
      {
        name: 'Block5',
        checked: false,
        sourcecodePath: 'block5',
        component: Block5,
      },  
    ],
   
};
export const getComponentByName = function(name){
    for (var item of DataSource.itemsData){
       if (item.name === name){
         return item.component;
       }
    }
}

export default DataSource;
