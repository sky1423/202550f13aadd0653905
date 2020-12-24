import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import axios from 'axios';
import moment from 'moment';

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

export default class App extends Component {

constructor(props){
  super(props)
  this.state={
    page:-1,
    posts:[],
    newScreen:false,
    item:{},
  }


}

componentDidMount(){
  setInterval(this.getData, 1000);

  this.getData();
}

getData= async()=>{
  await this.setState({page:this.state.page +1});
  let response = await axios.get(`https://hn.algolia.com/api/v1/search_by_date?page=${this.state.page}`)
 console.log('hey!')
  if(response.status==200){

   let posts = [...this.state.posts,...response.data.hits] 
   this.setState({posts})

  }



}

onEndReached=async()=>{

  
  this.getData();


}

render(){

  return(
        <View style={{backgroundColor:'red',flex:1,height:HEIGHT}}> 
        {this.state.newScreen == false ?
       <View>
        <FlatList

        data={this.state.posts}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={0.1}
        extraData={{...this.state.posts}}
        keyExtractor={(item)=>item.objectID}
        renderItem={({item,index})=>{
        return(

          <TouchableOpacity onPress={()=>this.setState({item,newScreen:true})} style={{height:80,width:WIDTH}}>
            <Text>{item.title}</Text>
            <Text>{item.url}</Text>
            <Text>{moment(item.created_at).format('DD/MM/YY')}</Text>
            <Text>{item.author}</Text>



          </TouchableOpacity>
          );

        }
        } /> </View>: <View>

          <TouchableOpacity onPress={async()=> await this.setState({newScreen:false})}> 

            <Text>Back</Text>



          </TouchableOpacity>

         <Text>{JSON.stringify(this.state.item)}</Text>

         </View>}
         </View>

        )
}}

