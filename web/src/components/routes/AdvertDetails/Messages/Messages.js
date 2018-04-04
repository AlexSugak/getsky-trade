import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import TextArea from 'components/layout/TextArea';
import { Button } from 'components/layout/Button';
import theme from 'components/theme';
import {
    messageStates,
    setMessagesState,
    setMessageText,
    postMessage,
    getMessages,
    getMessagesAuthors,
    selectAuthor,
} from './actions';

const MessageInput = styled(TextArea) `
    font-size: ${theme.fontSizes[1]}px;
`;

const MessagesInputForm = ({ onChange, messageText, sendMessage }) => (
    <div>
        <MessageInput placeholder="Your message" onChange={e => onChange(e.target.value)} value={messageText} />
        <p>Up to 10,000 characters</p>
        <Button text="Send message" onClick={sendMessage} />
    </div>
);

const getMessageAuthor = (advert, message, userInfo, selectedAuthor) => {
    if (message.author === userInfo.id && !selectedAuthor) {
        return userInfo.username;
    } else return advert.author;
};

const MessagesContainer = ({
    advert,
    userInfo,

    messages,
    selectedAuthor,

    messageText,
    onChange,

    sendMessage,
    backToUsers, }) => (
        <div>
            {selectedAuthor && <a onClick={backToUsers}>Back to users</a>}
            {messages.map((m, i) => (
                <div key={i}>
                    {getMessageAuthor(advert, m, userInfo, selectedAuthor)}: {m.body}
                </div>
            ))}
            <MessagesInputForm onChange={onChange} messageText={messageText} sendMessage={sendMessage} />
        </div>
    );

const UsersList = ({ authors, selectAuthor, userInfo }) => (
    <div>
        {authors.filter(a => a !== userInfo.username).map((a, i) => (
            <a key={i} onClick={() => selectAuthor(a)}>
                {a}
            </a>
        ))}
    </div>);

export default connect(
    ({
        app: { userInfo },
        messages,
    }) => ({
        userInfo,
        messages,
    }),
    {
        setMessagesState,
        setMessageText,
        postMessage,
        getMessages,
        getMessagesAuthors,
        selectAuthor,
    }
)(
    class extends React.Component {
        componentDidMount() {
            const { setMessagesState, getMessages, advert, userInfo, getMessagesAuthors } = this.props;

            setMessagesState(null);
            if (userInfo.username === advert.author) {
                getMessagesAuthors(advert.id);
            } else {
                getMessages(advert.id, userInfo.username);
            }
        }
        sendMessage = () => {
            const {
                messages,
                advert,
                userInfo,
                postMessage,
            } = this.props;

            const message = {
                body: messages.messageText,
                advertId: advert.id,
                author: userInfo.username,
            };
            postMessage(message);
        }
        selectAuthor = author => {
            this.props.getMessages(this.props.advert.id, author);
            this.props.selectAuthor(author);
        }
        reply = () => {
            const {
                messages,
                advert,
                userInfo,
                postMessage,
            } = this.props;

            const message = {
                body: messages.messageText,
                advertId: advert.id,
                author: userInfo.username,
                recipient: messages.messages[0].author,
            };
            postMessage(message);
        }
        backToUsers = () => {
            this.props.selectAuthor(null);
            this.props.setMessagesState(messageStates.users);
        }
        render() {
            const {
                advert,
                userInfo,

                messages,

                setMessageText,
            } = this.props;

            const state = messages.state || (userInfo.username === advert.author ? messageStates.users : messageStates.messages)

            return (
                <div>
                    {state === messageStates.messages
                        && <MessagesContainer
                            advert={advert}
                            userInfo={userInfo}
                            onChange={setMessageText}
                            selectedAuthor={messages.selectedAuthor}
                            messages={messages.messages}
                            messageText={messages.messageText}
                            backToUsers={this.backToUsers}
                            sendMessage={messages.selectedAuthor ? this.reply : this.sendMessage} />}
                    {state === messageStates.users
                        && <UsersList
                            authors={messages.authors}
                            userInfo={userInfo}
                            selectAuthor={this.selectAuthor} />}
                </div>
            );
        }
    })
