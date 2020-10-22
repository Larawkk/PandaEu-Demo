import React from 'react';
import './App.less';
import 'antd/dist/antd.css';
import moment from 'moment';
import { Divider, Row, Col, Tabs, Card, Typography, Button, Avatar, List, Modal, message, Popconfirm, Empty } from 'antd';
import { EnvironmentOutlined, WalletOutlined, PhoneOutlined, MailOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  getDataList,
  acceptData,
  declineData,
  sendMail
} from './services/api';

const { Text } = Typography;
const { confirm } = Modal;
const { TabPane } = Tabs;

//发送邮件对话框
function sendMailModal(emailID) {
  confirm({
    title: 'Do you want to send a email?',
    icon: <ExclamationCircleOutlined />,
    okText: "Yes",
    cancelText: "No",
    onOk() {
      return new Promise(async (resolve, reject) => {
        let formData = { emailID: emailID }
        let dataRes = await sendMail(formData);//请求发送邮箱
        console.log(dataRes)
        if (dataRes.data) {
          message.success('send success');
          resolve()
        } else {
          message.error('send error');
          reject()
        }
      }).catch(() => console.log('errors'));
    },
    onCancel() { }
  });
}

class LabelDom extends React.PureComponent {
  state = {
    invitedList: [],
    acceptedList: []
  }
  /**
  * @description 查询数据
  */
  handleSearch = async () => {
    try {
      let dataRes = await getDataList();//查询邀请标签数据
      this.setState({
        invitedList: dataRes.data.invited_userData,//邀请标签数据
        acceptedList: dataRes.data.accepted_userData //接受标签数据
      })
    } catch (error) {
      console.log(error);
    }
  }
  /**
  * @description 接受邀请处理
  * @param id
  */
  handleAccept = async (id) => {
    let formData = { id: id }
    try {
      let dataRes = await acceptData(formData);//请求接受操作处理
      console.log(dataRes)
      if (dataRes.data) {
        message.success('accept success');
      } else {
        message.error('accept error');
      }
      this.handleSearch();
    } catch (error) {
      console.log(error);
    }
  }
  /**
  * @description 拒绝邀请处理
  * @param id
  */
  handleDecline = async (id) => {
    let formData = { id: id }
    try {
      let dataRes = await declineData(formData);//请求拒绝操作处理
      console.log(dataRes)
      if (dataRes.data) {
        message.success('accept success');
      } else {
        message.error('accept error');
      }
      this.handleSearch();
    } catch (error) {
      console.log(error);
    }
  }
  /**
  * @description 初始数据载入
  */
  componentDidMount() {
    this.handleSearch();
  }

  render() {
    let invitedEmpty;
    let acceptedEmpty;
    if (this.state.invitedList.length == 0) {
      invitedEmpty = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }
    let empty;
    if (this.state.acceptedList.length == 0) {
      acceptedEmpty = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }
    return (
      <div className="App">
        <Tabs centered size={'large'}>
          <TabPane tab="Invited" key="1">
            {invitedEmpty}
            {this.state.invitedList.map((item) => <Card>
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar size={45} style={{ backgroundColor: '#FF8C00' }}>{item.userName.substr(0, 1)}</Avatar>}
                  title={item.userName}
                  description={moment(item.creationDate).format('YYYY-MM-DD HH:mm:ss')}
                />
              </List.Item>
              <Divider />
              <Row>
                <Col style={{ padding: '0px 20px 0px 0px' }}>
                  <EnvironmentOutlined style={{ fontSize: 15 }} /> {item.address}
                </Col>
                <Col style={{ padding: '0px 20px 0px 0px' }}>
                  <WalletOutlined style={{ fontSize: 15 }} /> {item.category}
                </Col>
                <Col>
                  Job ID: {item.ID}
                </Col>
              </Row>
              <Divider />
              <Text >
                {item.description}
              </Text>
              <Divider />
              <Row>
                <Col span={1}>
                  <Popconfirm
                    placement="topLeft"
                    title='Do you want to accept the invitation?'
                    onConfirm={() => this.handleAccept(item.ID)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="primary">Accept</Button>
                  </Popconfirm>
                </Col>
                <Col span={1}>
                  <Popconfirm
                    placement="topLeft"
                    title='Do you want to decline the invitation?'
                    onConfirm={() => this.handleDecline(item.ID)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="ghost">Decline</Button>
                  </Popconfirm>
                </Col>
                <Col>
                  <Text strong>${item.originalPrice}</Text> Lead invitation
              </Col>
              </Row>
            </Card>)}

          </TabPane>
          <TabPane tab="Accepted" key="2">
            {acceptedEmpty}
            {this.state.acceptedList.map((item) => <Card>
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar size={45} style={{ backgroundColor: '#666666' }}>{item.userName.substr(0, 1)}</Avatar>}
                  title={item.userName}
                  description={moment(item.creationDate).format('YYYY-MM-DD HH:mm:ss')}
                />
              </List.Item>
              <Divider />
              <Row>
                <Col style={{ padding: '0px 20px 0px 0px' }}>
                  <EnvironmentOutlined style={{ fontSize: 15 }} /> {item.address}
                </Col>
                <Col style={{ padding: '0px 20px 0px 0px' }}>
                  <WalletOutlined style={{ fontSize: 15 }} /> {item.category}
                </Col>
                <Col style={{ padding: '0px 20px 0px 0px' }}>
                  Job ID: {item.ID}
                </Col>
                <Col>
                  <Text strong>${item.discountedPrice}</Text> Lead invitation
              </Col>
              </Row>
              <Divider />
              <Row>
                <Col style={{ padding: '0px 20px 0px 0px' }} span='2'>
                  <PhoneOutlined style={{ fontSize: 15 }} /><a style={{ color: "#FF8C00" }}>{item.phone}</a>
                </Col>
                <Col style={{ padding: '0px 20px 0px 0px' }} span='22'>
                  <MailOutlined style={{ fontSize: 15 }} /><a onClick={() => sendMailModal(item.emailID)} style={{ color: "#FF8C00" }}>{item.emailID}</a>
                </Col>
                <Col>
                  <Text >
                    {item.description}
                  </Text>
                </Col>
              </Row>
            </Card>)}

          </TabPane>
        </Tabs >
      </div>
    )
  }
}
export default LabelDom;