/*
 * Copyright 2018 DoubleDutch, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react'
import {Image} from 'react-native'

export default (props) => {
  const style = { 
    marginTop: 4,
    marginLeft: 5,
    height: 12,
    width: 12
  }
  return <Image source={{uri}} style={[style, props.style]} alt="chevron" />
}

const uri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAOCAYAAAA8E3wEAAAAAXNSR0IArs4c6QAAAcpJREFUOBG1k8lKw1AUhk1aCi4clqLWnTt9B0FEqfoAgjjEdBLciki37kSqIk0T2y59AleiFNEXsC6d0BcQHBYdUr/E3nJJYxGHwuH+Z/r/e25PFMMwIvV63ej4/G0lEglTUZR6w//1kc1mY7ZtpxwieBNKJpN5BIcFM8FTLqAnk8kHEfvJidAQPIfYhNT/pEqOCykYB5SYfBWsePPf8RHTmarkEXNbFZLTJI6wLi8Z0xZDodCKpml33pyfb1nWYLVaPSQ36c3D9YLNqfF4/Bgwgp14i7jEWLlcvmLaNXDbaalZrtVq135ixM6CweCoqyWL8H9G8bexbjnuYC50jmk03cq5XC7XX6lULC4UkeMN/Kqq6nosFjPodRex5db5fD7MVCYEU14Cmt6JbSK6D7aZagF/l9pen9piIBDQotHovZxrERRJ0zQ1/vgdyHpETJyIXRB/xp8RMXGSeyO3wed1AG75vL4UdAh44gGanGn9nktoNE9qfZ+9WQBoKygK2eRFRNNYy9M5NQiJp97zm0rwuLWy0w43lsNAdFauQ+CSDVzSdf1Gjn+FvzWh3MyizOM7i9KJWIoFSnPacs2f40Kh0Ifw8J8T/wfhB7JEzGRRAYKOAAAAAElFTkSuQmCC'