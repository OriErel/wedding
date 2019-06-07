import React from 'react';
import { compose, withState, withHandlers, lifecycle, branch, renderNothing } from 'recompose';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';

import Button from '@material-ui/core/Button';

import axios from 'axios';

import CoupleImage from '../../public/couple.jpg';

const Container = styled.div`
  text-align: center;

  @media (min-width: 768px) {
    width: 400px;
    margin: 50px auto 0 auto;
  }
`;

const TopImg = styled.img`
  width: 100%;
  height: auto;
  border-bottom: 1px solid #cdcdcd;

  @media (min-width: 480px) {
    position: fixed;
    opacity: 0.3;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Title = styled.div`
  margin-bottom: 15px;
  font-size: 40px;
`;

const Body = styled.div`
  font-size: 18px;
  margin-bottom: 20px;
  opacity: ${({ transparent }) => (transparent ? 0 : 1)};
  transition: opacity 0.3s;
`;

const AmountOfGuests = styled.div`
  margin-top: 3px;
`;

const NumericButton = styled(Button)`
  background: #0008ff26 !important;
  min-width: 0 !important;
  padding: 0 9px !important;
  border: 1px solid #212121 !important;
`;

const NumericSpan = styled.span`
  font-size: 14px;
  margin: 0 15px;
`;

const CommentContainer = styled.div`
  margin-top: 30px;
`;

const CommentInput = styled.input`
  display: block;
  margin: 0 auto;
  border: 1px solid rgb(82, 82, 82);
  height: 18px;
  width: 60%;
  color: #212121;
  border-radius: 2px;
`;

const RSVPContainer = styled.div`
  margin-top: 30px;
`;

const RSVPButtons = styled.div`
  margin-top: 5px;
`;

const RSVPGoingButton = styled(Button)`
  background-color: #4aa14a !important;
  color: white !important;
  margin-left: 30px !important;
`;

const RSVPNotGoingButton = styled(Button)`
  background-color: #ce3837 !important;
  color: white !important;
`;

const FAIcon = styled.i`
  margin-right: 5px;
`;

const RSVPMessage = styled.div`
  margin-top: 30px;
`;

const ChangeRSVP = styled.div`
  margin-top: 40px;
`;

const ChangeRSVPButton = styled(Button)`
  color: #1a60b4 !important;
  border: 1px solid #1a60b4 !important;
`;

const GuestRSVPComponent = ({
  guest,
  transparentBody,
  increaseAmountOfPeople,
  decreaseAmountOfPeople,
  commentChange,
  rsvp,
}) => (
  <Container>
    <TopImg src={CoupleImage} />

    <Title>
      שלום {guest.firstName} {guest.lastName}
    </Title>

    <Body transparent={transparentBody}>
      {guest.rsvp == null && (
        <div>
          אנא
          {guest.gender === 'MALE' ? ' סמן ' : ' סמני '}
          מספר אנשים
          <AmountOfGuests>
            <NumericButton onClick={() => increaseAmountOfPeople()}>+</NumericButton>
            <NumericSpan>{guest.amountOfPeople}</NumericSpan>
            <NumericButton onClick={() => decreaseAmountOfPeople()}>-</NumericButton>
          </AmountOfGuests>
          <CommentContainer>
            הערות
            <CommentInput type={'text'} value={guest.comment || ''} onChange={commentChange} />
          </CommentContainer>
          <RSVPContainer>
            אנא
            {guest.gender === 'MALE' ? ' אשר ' : ' אשרי '}
            הגעתך לחתונתנו
            <RSVPButtons>
              <RSVPGoingButton onClick={() => rsvp('ATTENDING')}>מגיע</RSVPGoingButton>
              <RSVPNotGoingButton onClick={() => rsvp('NOT ATTENDING')}>לא מגיע</RSVPNotGoingButton>
            </RSVPButtons>
          </RSVPContainer>
        </div>
      )}
      {guest.rsvp !== null && (
        <div>
          {guest.rsvp === 'ATTENDING' && (
            <RSVPMessage>
              תודה על המענה, נתראה בקרוב
              <FAIcon className="fa fa-smile-o" aria-hidden="true" />
            </RSVPMessage>
          )}

          {guest.rsvp === 'NOT ATTENDING' && (
            <RSVPMessage>
              תודה על המענה, צר לנו שלא
              {guest.gender === 'MALE' ? ' תגיע' : ' תגיעי'}
              <FAIcon className="fa fa-frown-o" aria-hidden="true" />
            </RSVPMessage>
          )}

          <ChangeRSVP>
            <ChangeRSVPButton variant={'outlined'} onClick={() => rsvp(null)}>
              {guest.gender === 'MALE' ? 'לחץ ' : 'לחצי '}
              כאן על מנת לשנות בחירתך
            </ChangeRSVPButton>
          </ChangeRSVP>
        </div>
      )}
    </Body>
  </Container>
);

const withGuestRSVP = compose(
  withState('guestId', 'setGuestId'),
  withState('guest', 'setGuest'),
  withState('transparentBody', 'setTransparentBody'), // For CSS transitions
  withHandlers({
    increaseAmountOfPeople: ({ guest, setGuest }) => () => {
      guest.amountOfPeople = guest.amountOfPeople >= 9 ? 9 : guest.amountOfPeople + 1;
      setGuest(guest);
    },
    decreaseAmountOfPeople: ({ guest, setGuest }) => () => {
      guest.amountOfPeople = guest.amountOfPeople <= 1 ? 1 : guest.amountOfPeople - 1;
      setGuest(guest);
    },
    commentChange: ({ guest, setGuest }) => e => {
      guest.comment = e.target.value;
      setGuest(guest);
    },
    rsvp: ({ guest, setGuest, setTransparentBody }) => rsvp => {
      setTransparentBody(true);
      setTimeout(() => {
        guest.rsvp = rsvp;
        setGuest(guest);
        setTransparentBody(false);
      }, 300);

      if (rsvp !== null) {
        const { comment, amountOfPeople } = guest;

        axios.post(`/api/guest/${guest.id}`, {
          rsvp,
          comment,
          amountOfPeople,
        });
      }
    },
  }),
  lifecycle({
    async componentDidMount() {
      const { match, setGuest } = this.props;

      const guestId = match.params.guestId;

      const { data } = await axios.get(`/api/guest/${guestId}`);
      setGuest(data);
    },
  }),
  branch(({ guest }) => !guest, renderNothing),
);

export const GuestRSVP = compose(
  hot,
  withGuestRSVP,
)(GuestRSVPComponent);
