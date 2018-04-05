import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';

import Icon, { IconMap } from 'components/layout/Icon';
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
    markMessageAsRead,
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

const Section = styled(Flex) `
    margin: 5px 0px;
    background-color: ${theme.colors.white};
    padding: 5px 10px;
`;
const SectionPart = styled(Box) `
    margin: 5px 0px;

    svg {
        margin-right: 5px;
    }
`;
const UsernameSectionPart = styled(SectionPart) `
    color: ${props => props.isRead ? theme.colors.gray : theme.colors.red};
`;
const Date = styled(SectionPart) `
    color: ${theme.colors.lightGray};
    font-size: 12px;
    text-align: right;
`;

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
                <Section key={i} flexDirection="row" flexWrap="wrap">
                    <UsernameSectionPart w={1} isRead={m.author === userInfo.username || m.isRead}>
                        <Icon name={IconMap.User} />
                        {m.author}
                    </UsernameSectionPart>
                    <SectionPart w={1}>
                        {m.body}
                    </SectionPart>
                    <Date w={1}>
                        {m.createdAt}
                    </Date>
                </Section>
            ))}
            <MessagesInputForm onChange={onChange} messageText={messageText} sendMessage={sendMessage} />
        </div>
    );

const UserSection = styled(Section) `
    cursor: pointer;
`;

const UsersList = ({ authors, selectAuthor, userInfo }) => (
    <div>
        {authors.filter(a => a.author !== userInfo.username)
            .map((a, i) => (
                <UserSection
                    key={i}
                    flexDirection="row"
                    flexWrap="wrap"
                    onClick={() => selectAuthor(a.author)}>
                    <SectionPart w={1}>
                        <Icon name={IconMap.Envelope} />
                        {a.newMessages} new / {a.totalMessages} messages
                    </SectionPart>
                    <UsernameSectionPart w={1} isRead={true}>
                        From <strong> {a.author} </strong>
                    </UsernameSectionPart>
                    <Date w={1}>
                        Last message on {a.lastMessageTime}
                    </Date>
                </UserSection>
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
        markMessageAsRead,
    }
)(
    class extends React.Component {
        async componentDidMount() {
            const { setMessagesState, getMessages, advert, userInfo, getMessagesAuthors, markMessageAsRead } = this.props;

            setMessagesState(null);
            if (userInfo.username === advert.author) {
                getMessagesAuthors(advert.id);
            } else {
                const messages = await getMessages(advert.id, userInfo.username);
                messages
                    .filter(m => !m.isRead && m.author !== userInfo.username)
                    .forEach(m => markMessageAsRead(m.id));
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
        selectAuthor = async author => {
            const messages = await this.props.getMessages(this.props.advert.id, author);
            this.props.selectAuthor(author);

            messages
                .filter(m => !m.isRead && m.author !== this.props.userInfo.username)
                .forEach(m => this.props.markMessageAsRead(m.id));
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
