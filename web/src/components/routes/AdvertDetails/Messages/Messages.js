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

const MessageInputNote = styled.p`
    font-size: ${theme.fontSizes[0]}px;
    margin-top: 3px;
    margin-bottom: 7px;

    color: ${theme.colors.gray};
`;

const MessageInputError = styled(MessageInputNote) `
    color: ${theme.colors.red};
`;

const MessagesInputForm = ({ onChange, messageText, sendMessage }) => (
    <div>
        <MessageInput placeholder="Your message" onChange={e => onChange(e.target.value)} value={messageText} />
        <MessageInputNote>Up to 10,000 characters</MessageInputNote>
        {messageText.length >= 10000 && <MessageInputError>Characters limit is exceeded</MessageInputError>}
        <Button disabled={messageText.length >= 10000} text="Send message" onClick={sendMessage} />
    </div>
);

const Section = styled(Flex) `
    margin: ${theme.spaces[0]}px 0px;
    background-color: ${theme.colors.white};
    padding: ${theme.spaces[0]}px ${theme.spaces[1]}px;
`;
const SectionPart = styled(Box) `
    margin: ${theme.spaces[0]}px 0px;

    svg {
        margin-right: ${theme.spaces[0]}px;
    }
`;
const UsernameSectionPart = styled(({ isRead, children, ...rest }) => <SectionPart {...rest}>{children}</SectionPart>) `
    color: ${props => props.isRead ? theme.colors.gray : theme.colors.red};
`;
const DateView = styled(SectionPart) `
    color: ${theme.colors.lightGray};
    font-size: ${theme.fontSizes[0]}px;
    text-align: right;
`;

const dateToString = d => `${d.toLocaleDateString().toLocaleUpperCase()} ${d.toLocaleTimeString().toLocaleUpperCase()}`;

const BackLink = styled.a`
        cursor: pointer;
    font-size: ${theme.fontSizes[1]}px;

    svg {
        margin - right: 3px;
}

    &:hover {
        color: ${theme.colors.gray};
}
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
            {selectedAuthor &&
                <BackLink onClick={backToUsers}>
                    <Icon name={IconMap.AngleLeft} />
                    Back to users
                </BackLink>}
            {messages.map((m, i) => (
                <Section key={i} flexDirection="row" flexWrap="wrap">
                    <UsernameSectionPart w={1} isRead={m.author === userInfo.username || m.isRead}>
                        <Icon name={IconMap.User} />
                        {m.author}
                    </UsernameSectionPart>
                    <SectionPart w={1}>
                        {m.body}
                    </SectionPart>
                    <DateView w={1}>
                        {dateToString(new Date(m.createdAt))}
                    </DateView>
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
                    <DateView w={1}>
                        Last message on {dateToString(new Date(a.lastMessageTime))}
                    </DateView>
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
