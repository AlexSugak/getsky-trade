import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';

import Icon, { IconMap } from 'components/layout/Icon';
import TextArea from 'components/layout/TextArea';
import { Button } from 'components/layout/Button';
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
    font-size: ${props => props.theme.fontSizes[1]}px;
    height: 76px;
`;

const MessageInputNote = styled.p`
    font-size: ${props => props.theme.fontSizes[0]}px;
    margin-top: ${props => props.theme.spaces[1]}px;
    margin-bottom: ${props => props.theme.spaces[3]}px;

    color: ${props => props.theme.colors.grayBlue};
`;

const MessageInputError = styled(MessageInputNote) `
    color: ${props => props.theme.colors.red};
`;

const MessagesInputFormContainer = styled.div`
    margin-top: ${props => props.theme.spaces[3]}px;
    button {
        float: right;
    }
`;

const MessageInputLabel = styled.p`
    color: ${props => props.theme.colors.grayBlue};
    font-size: ${props => props.theme.fontSizes[0]}px;
    margin: 0;
    margin-bottom: ${props => props.theme.spaces[1]}px;
`;

const MessagesInputForm = ({ onChange, messageText, sendMessage }) => (
    <MessagesInputFormContainer>
        <MessageInputLabel>Your message</MessageInputLabel>
        <MessageInput placeholder="Your message" onChange={e => onChange(e.target.value)} value={messageText} />
        <MessageInputNote>Up to 10,000 characters</MessageInputNote>
        {messageText.length >= 10000 && <MessageInputError>Characters limit is exceeded</MessageInputError>}
        <Button primary disabled={messageText.length === 0 || messageText.length >= 10000} text="Send message" onClick={sendMessage} />
    </MessagesInputFormContainer>
);

const Section = styled(Flex) `
    margin: ${props => props.theme.spaces[0]}px 0px;
    background-color: ${props => props.theme.colors.white};
    padding: ${props => props.theme.spaces[0]}px ${props => props.theme.spaces[1]}px;
`;
const SectionPart = styled(Box) `
    margin: ${props => props.theme.spaces[0]}px 0px;

    svg {
        margin-right: ${props => props.theme.spaces[0]}px;
    }
`;
const UsernameSectionPart = styled(({ isRead, children, ...rest }) => <SectionPart {...rest}>{children}</SectionPart>) `
    color: ${props => props.isRead ? props.theme.colors.gray : props.theme.colors.red};
    margin-bottom: 0;
`;
const DateView = styled(SectionPart) `
    color: ${props => props.theme.colors.grayBlue};
    font-size: ${props => props.theme.fontSizes[0]}px;
    text-align: right;
`;

const dateToString = d => `${d.toLocaleDateString().toLocaleUpperCase()} ${d.toLocaleTimeString().toLocaleUpperCase()}`;

const BaseLink = styled.a`
    cursor: pointer;
    font-size: ${props => props.theme.fontSizes[1]}px;
    color: ${props => props.theme.colors.blue};

    svg {
        margin-right: ${props => props.theme.spaces[1]}px;
        color: ${props => props.theme.colors.blue};
    }

    &:hover {
        text-decoration: underline;
    }
`;

const BackLink = styled(BaseLink) `
    font-size: ${props => props.theme.fontSizes[1]}px;
`;

const Username = styled(Box) `
    margin: 0;
    font-weight: bold;
    font-size: ${props => props.theme.fontSizes[3]}px;
`;

const NewMessagesInfo = styled.span`
    color: ${props => props.theme.colors.red};
    font-weight: bold;
`;

const MessagesInfo = styled(Box) `
    color: ${props => props.theme.colors.grayBlue};
    font-size: ${props => props.theme.fontSizes[0]}px;

    div {
        float: left;
        margin-right: 3px;
        margin-top: -3px;
    }
`;

const UsernameContainer = styled(Flex) `
    border-bottom: 1px solid ${props => props.theme.colors.separator};
`;

const ShowMoreLink = styled(BaseLink) `
    font-size: ${props => props.theme.fontSizes[0]}px;
    text-align: center;
`;

const AuthorInfo = styled.div`
    width: 100%;
`;

const ShowMoreLinkContainer = styled.div`
    width: 100%;
    text-align: center;
`;

const Author = ({ backToUsers, selectedAuthor, messages }) => (
    <AuthorInfo>
        <BackLink onClick={backToUsers}>
            <Icon name={IconMap.AngleLeft} />
            Back to users
        </BackLink>
        <UsernameContainer
            flexDirection="row"
            justifyContent="space-between"
            alignItems="flex-end"
            mt={2} pb={4} mb={4}>
            <Username>Messages from {selectedAuthor}</Username>
            <MessagesInfo>
                <Icon name={IconMap.Envelope} />
                <NewMessagesInfo> {messages.filter(m => !m.isRead).length} new </NewMessagesInfo> / {messages.length}
            </MessagesInfo>
        </UsernameContainer>
        <ShowMoreLinkContainer>
            <ShowMoreLink onClick={() => { }}>Show more </ShowMoreLink>
        </ShowMoreLinkContainer>
    </AuthorInfo>
);

const getAuthorInitials = author => {
    const words = author.split(' ');
    if (words.length >= 2) {
        return `${words[0]}${words[1]}`.toUpperCase();
    }
    return author[0].toString().toUpperCase();
};

const UserInitials = styled.div`
    background-color: ${props => props.isMyMessage ? props.theme.colors.blue : props.theme.colors.lightPink};
    color: ${props => props.theme.colors.white};
    width: 44px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    border: 1px solid ${props => props.isMyMessage ? props.theme.colors.blue : props.theme.colors.lightPink};
    border-radius: 100px;
    font-size: ${props => props.theme.fontSizes[3]}px;
`;

const UsernameLabel = styled.span`
    color: ${props => props.theme.colors.grayBlue};
    font-size: ${props => props.theme.fontSizes[0]}px;

    margin-top: ${props => props.theme.spaces[1]}px;
    margin-left: ${props => props.theme.spaces[6]}px;
`;

const BaseTriangle = styled.div`
    width: 0;
    height: 0;
    border-style: solid;
`;

const Triangle = styled(BaseTriangle) `
    border-width: 12px 0 0 12px;
    border-color: transparent transparent transparent ${props => props.isMyMessage ? props.theme.colors.lightGreen : props.theme.colors.lightBlue};
    margin-left: 12px;
`;

const ReverseTriangle = styled(BaseTriangle) `
    border-width: 0 0 12px 12px;
    border-color: transparent transparent ${props => props.isMyMessage ? props.theme.colors.lightGreen : props.theme.colors.lightBlue} transparent;
    margin-right: 12px;
`;

const MessageBody = styled(SectionPart) `
    background-color: ${props => props.isMyMessage ? props.theme.colors.lightGreen : props.theme.colors.lightBlue};
    font-size: ${props => props.theme.fontSizes[1]}px;
    padding: ${props => props.theme.spaces[2]}px ${props => props.theme.spaces[3]}px;
    margin: 0;
    margin-${ props => props.isMyMessage ? 'right' : 'left'}: ${44 + 12}px;
`;

const Message = ({ m, userInfo }) => {
    const isMyMessage = m.author === userInfo.username;
    return (<Section flexDirection="column" flexWrap="wrap">
        <UsernameSectionPart w={1} isRead={isMyMessage || m.isRead}>
            {!isMyMessage && <Flex alignItems="flex-start" justifyContent="space-between">
                <Flex>
                    <Flex alignItems="flex-end">
                        <UserInitials isMyMessage={isMyMessage}>
                            {getAuthorInitials(m.author)}
                        </UserInitials>
                        <Triangle isMyMessage={isMyMessage} />
                    </Flex>
                    <UsernameLabel>{m.author}</UsernameLabel>
                </Flex>
                <DateView >
                    {dateToString(new Date(m.createdAt))}
                </DateView>
            </Flex>}
            {isMyMessage && <Flex alignItems="flex-start" justifyContent="space-between">
                <DateView >
                    {dateToString(new Date(m.createdAt))}
                </DateView>
                <Flex>
                    <UsernameLabel>{m.author}</UsernameLabel>
                    <Flex alignItems="flex-end">
                        <ReverseTriangle isMyMessage={isMyMessage} />
                        <UserInitials isMyMessage={isMyMessage}>
                            {getAuthorInitials(m.author)}
                        </UserInitials>
                    </Flex>
                </Flex>
            </Flex>}
        </UsernameSectionPart>
        <MessageBody isMyMessage={isMyMessage}>
            {m.body}
        </MessageBody>
    </Section>
    );
}

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
            {selectedAuthor && <Author backToUsers={backToUsers} selectedAuthor={selectedAuthor} messages={messages} />}
            {messages.map((m, i) => (<Message key={i} m={m} userInfo={userInfo} />))}
            <MessagesInputForm onChange={onChange} messageText={messageText} sendMessage={sendMessage} />
        </div>
    );

const UserSection = styled(Section) `
    border-bottom: 1px solid ${props => props.theme.colors.separator};
    border-top: 1px solid ${props => props.theme.colors.separator};
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

const Container = styled.div`
    width: 100%;
`;

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
                <Container>
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
                </Container>
            );
        }
    })
