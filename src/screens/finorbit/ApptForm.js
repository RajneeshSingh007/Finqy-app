import React from 'react';
import {StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {Subtitle, Title, View} from '@shoutem/ui';
import {Colors} from 'react-native-paper';
import {sizeFont, sizeHeight, sizeWidth} from '../../util/Size';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import * as Pref from '../../util/Pref';
import CustomForm from './CustomForm';

let date = new Date();

export default class ApptForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    const currentdate = moment().toDate();
    const obj = moment().toObject();

    currentdate.setDate(Number(obj.date+1));
    
    const maxDate = moment().toDate();
    maxDate.setDate(Number(obj.date+1));
    maxDate.setMonth(Number(obj.months+1))

    console.log('date', date.getDay(),currentdate,maxDate);
    this.state = {
      showCalendar: false,
      currentDate: currentdate,
      showdatesx: currentdate,
      maxDates:maxDate,
      mode: 'date',
      currentTime: '',
      baa: 'Schedule an Appointment',
      remark: '',
    };
  }

  restoreData(obj){
    //console.log('obj', obj);
    if(obj !== undefined){
          this.setState(obj);

    }
  }

  onChange = (event, selectedDate) => {
    if (selectedDate !== undefined && selectedDate !== null) {
      if (this.state.mode == 'date') {
        this.setState({
          currentDate: selectedDate,
          showdatesx: selectedDate,
          mode: 'time',
          intervaltime: 30,
        });
      } else {
        const hours = selectedDate.getHours();
        const time = selectedDate.getMinutes();
        if (hours >= 10 && hours <= 18) {
          //if (time === 0 || time === 30) {
          this.state.showdatesx.setHours(hours, time, 0, 0);
          const current = moment(this.state.showdatesx).format(
            'DD-MM-YYYY hh:mm A',
          );
          this.setState({baa: current, mode: 'date', showCalendar: false});
          // } else {
          //     alert('Please, select 00 or 30 min');
          //     this.setState({ showCalendar: false, mode: 'date' });
          // }
        } else {
          alert('Please, select time between 10AM - 7PM');
          this.setState({showCalendar: false, mode: 'date'});
        }
      }
    } else {
      this.setState({showCalendar: false, mode: 'date'});
    }
  };

  render() {
    const {title} = this.props;
    return (
      <View>
        {/* <View
          style={{
            marginTop: sizeHeight(2),
            marginBottom: sizeHeight(1),
          }}
          styleName="horizontal">
          <View styleName="vertical" style={{marginStart: sizeWidth(2)}}>
            <Title style={styles.title}> {`Appointment`}</Title>
          </View>
        </View>
        <View style={styles.line} /> */}

        <View style={styles.radiocont}>
          <TouchableWithoutFeedback
            onPress={() =>
              this.setState({
                showCalendar: true,
              })
            }>
            <View style={styles.dropdownbox}>
              <Title
                style={{
                  fontSize: 15,
                  fontWeight: '700',
                  lineHeight: 20,
                  alignSelf: 'center',
                  color:
                    this.state.baa === `Schedule an Appointment`
                      ? '#6d6a57'
                      : `#555555`,
                  alignSelf: 'center',
                }}>
                {this.state.baa}
              </Title>
              <Icon
                name={'calendar'}
                size={24}
                color={'#6d6a57'}
                style={{
                  alignSelf: 'center',
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <CustomForm
          value={this.state.remark}
          onChange={(v) => this.setState({remark: v})}
          label={`Remark`}
          placeholder={`Say something...`}
          keyboardType={'done'}
          multiline
        />

        {this.state.showCalendar ? (
          <DateTimePicker
            value={this.state.currentDate}
            onChange={this.onChange}
            maximumDate={this.state.maxDates}
            minimumDate={this.state.currentDate}
            mode={this.state.mode}
            is24Hour={false}
            //minimumDate={date}
            display={'spinner'}
          />
        ) : null}
      </View>
    );
  }
}

/**
 * styles
 */
const styles = StyleSheet.create({
  dropdownbox: {
    flexDirection: 'row',
    height: 56,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },

  radiocont: {
    marginStart: 10,
    marginEnd: 10,
    borderBottomWidth: 1.3,
    borderBottomColor: '#f2f1e6',
    alignContent: 'center',
  },
  line: {
    backgroundColor: Pref.RED,
    height: 1.2,
    marginHorizontal: sizeWidth(3),
    marginTop: 4,
    marginBottom: 4,
  },
  line1: {
    backgroundColor: '#dedede',
    height: 1.2,
    marginHorizontal: sizeWidth(3),
    marginTop: 4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: '#767676',
    alignSelf: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
  },
  title1: {
    fontSize: 16,
    fontFamily: 'Rubik',
    fontFamily: '400',
    letterSpacing: 1,
    color: '#242424',
    alignSelf: 'flex-start',
  },
});
