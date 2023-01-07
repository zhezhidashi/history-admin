import Mock from "mockjs";
import user from './MockServeData/user'

Mock.mock(/api\/getusers/, 'get', user.getUserList)
Mock.mock('/api/createuser', 'post', user.createUser)
Mock.mock('/api/deluser', 'post', user.deleteUser)
Mock.mock('/api/edituser', 'post', user.updateUser)