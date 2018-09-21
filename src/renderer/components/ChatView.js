const React = require('react')
const CONSTANTS = require('deltachat-node/constants')
const { ipcRenderer } = require('electron')

const SetupMessageDialog = require('./dialogs/SetupMessage')
const Composer = require('./Composer')

const {
  Alignment,
  Classes,
  Position,
  Menu,
  Popover,
  Button
} = require('@blueprintjs/core')

const { Message } = require('conversations').conversation
const { ConversationContext } = require('conversations').styleguide

var theme = 'light-theme' // user prefs?

class ChatView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      error: false,
      setupMessage: false
    }
    this.onSetupMessageClose = this.onSetupMessageClose.bind(this)
  }

  writeMessage (message) {
    var chatId = this.props.chat.id
    ipcRenderer.send('dispatch', 'sendMessage', chatId, message)
  }

  componentWillUnmount () {
    var chatId = this.props.chat.id
    ipcRenderer.send('dispatch', 'clearChatPage', chatId)
  }

  componentDidMount () {
    const chat = this.props.chat
    this.setState({ value: chat.textDraft })
    this.scrollToBottom()
  }

  scrollToBottom (force) {
    var messagesDiv = document.querySelector('.message-list')
    if (messagesDiv) {
      messagesDiv.scrollTop = messagesDiv.scrollHeight
    }
  }

  clickSetupMessage (setupMessage) {
    this.setState({ setupMessage })
  }

  onSetupMessageClose () {
    // TODO: go back to main chat screen
    this.setState({ setupMessage: false })
  }

  render () {
    const { setupMessage } = this.state
    const { chat } = this.props

    console.log('got chat', chat)
    return (
      <div>
        <SetupMessageDialog setupMessage={setupMessage} onClose={this.onSetupMessageClose} />
        {this.state.error && this.state.error}
        <div>
          <ConversationContext theme={theme}>
            {chat.messages.map((message) => {
              const msg = <RenderMessage message={message} />
              if (message.msg.isSetupmessage) {
                return <li onClick={this.clickSetupMessage.bind(this, message)}>
                  {msg}
                </li>
              }

              return <li>{msg}</li>
            })}
          </ConversationContext>
        </div>
        <Composer onSubmit={this.writeMessage.bind(this)} />
      </div>
    )
  }
}

class RenderMessage extends React.Component {
  render () {
    const { message } = this.props
    const timestamp = message.msg.timestamp * 1000
    const direction = message.isMe ? 'outgoing' : 'incoming'
    const contact = {
      onSendMessage: () => console.log('send a message to', message.fromId),
      onClick: () => console.log('clicking contact', message.fromId)
    }

    var props = {
      id: message.id,
      i18n: window.translate,
      conversationType: 'direct', // or group
      direction,
      contact,
      authorName: message.contact.displayName,
      authorPhoneNumber: message.contact.address,
      status: convertMessageStatus(message.msg.state),
      timestamp
    }

    if (message.msg.file) {
      props.attachment = { url: message.msg.file, contentType: message.filemime }
    } else {
      props.text = message.msg.text
    }

    return (<Message {...props} />)
  }
}

function convertMessageStatus (s) {
  switch (s) {
    case CONSTANTS.DC_STATE_IN_FRESH:
      return 'sent'
    case CONSTANTS.DC_STATE_OUT_FAILED:
      return 'error'
    case CONSTANTS.DC_STATE_IN_SEEN:
      return 'read'
    case CONSTANTS.DC_STATE_IN_NOTICED:
      return 'read'
    case CONSTANTS.DC_STATE_OUT_DELIVERED:
      return 'delivered'
    case CONSTANTS.DC_STATE_OUT_MDN_RCVD:
      return 'read'
    case CONSTANTS.DC_STATE_OUT_PENDING:
      return 'sending'
    case CONSTANTS.DC_STATE_UNDEFINED:
      return 'error'
  }
}

module.exports = ChatView
