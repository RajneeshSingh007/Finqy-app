import React from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {Subtitle, View, Title} from '@shoutem/ui';
import {Checkbox} from 'react-native-paper';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {sizeWidth} from '../../util/Size';
import moment from 'moment';
import CommonFileUpload from '../common/CommonFileUpload';
import Lodash from 'lodash';
import NewDropDown from '../component/NewDropDown';
import FilePicker from '../common/FilePicker';

const currentAddressProofList = [
  {
    value: 'Aadhar',
    checked: 'unchecked',
  },
  {
    value: 'Electricity Bill',
    checked: 'unchecked',
  },
  {
    value: 'Landline Bill',
    checked: 'unchecked',
  },
  {
    value: 'License',
    checked: 'unchecked',
  },
  // {
  //   value: 'Passport+B45',
  //   checked: 'unchecked',
  // },
  {
    value: 'Postpaid Bill',
    checked: 'unchecked',
  },
  {
    value: 'Rent Agreement',
    checked: 'unchecked',
  },
  {
    value: 'Voter ID',
    checked: 'unchecked',
  },
];

var proofOfProprtyList = [
  {
    value: `Electricity Bill`,
  },
  {
    value: `Society Maintenance Bill`,
  },
  {
    value: `Water Bill`,
  },
];

const existingLoanDocumentList = [
  {
    value: 'Foreclosure Document',
  },
  {
    value: `Current Loan Repayment Statement`,
  },
  // {
  //   value: `Credit Card Front Copy`,
  //   checked: 'unchecked',
  // },
  // {
  //   value: `2 Months Card Statement`,
  //   checked: 'unchecked',
  // },
  {value: 'LOD'},
  {
    value: `Sanction Letter`,
  },
  {
    value: `Statement of Accounts`,
  },
];

const listoffiles = [
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  {
    count: 0,
    filled: [],
    downloadUrl: [],
    names: [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
];

// const popitemList = [
//   {
//     value:'',
//     options:[
//       {value: 'Share Certificate'},
//       {value: 'Maintenance Slip'},
//       {value: 'Property Tax'},
//       {value: 'Water Bill'},
//     ],
//     key:'pop_electricity'
//   }
// ]

const lapPopList = [
  {
    enable: true,
    value: '',
    options: [
      {
        value: `Electricity Bill`,
      },
      {
        value: `Society Maintenance Bill`,
      },
      {
        value: `Water Bill`,
      },
    ],
    key: 'pop_electricity',
    res: {},
  },
  {
    enable: false,
    value: '',
    options: [
      {
        value: `Electricity Bill`,
      },
      {
        value: `Society Maintenance Bill`,
      },
      {
        value: `Water Bill`,
      },
    ],
    key: 'pop_electricity1',
    res: {},
  },
  {
    enable: false,
    value: '',
    options: [
      {
        value: `Electricity Bill`,
      },
      {
        value: `Society Maintenance Bill`,
      },
      {
        value: `Water Bill`,
      },
    ],
    key: 'pop_electricity2',
    res: {},
  },
];

const btpopList = [
  {
    enable: true,
    value: '',
    options: [
      {value: 'Share Certificate'},
      {value: 'Maintenance Slip'},
      {value: 'Property Tax'},
      {value: 'Water Bill'},
    ],
    key: 'pop_electricity',
    res: {},
  },
  {
    enable: false,
    value: '',
    options: [
      {value: 'Share Certificate'},
      {value: 'Maintenance Slip'},
      {value: 'Property Tax'},
      {value: 'Water Bill'},
    ],
    key: 'pop_electricity1',
    res: {},
  },
  {
    enable: false,
    value: '',
    options: [
      {value: 'Share Certificate'},
      {value: 'Maintenance Slip'},
      {value: 'Property Tax'},
      {value: 'Water Bill'},
    ],
    key: 'pop_electricity2',
    res: {},
  },
  {
    enable: false,
    value: '',
    options: [
      {value: 'Share Certificate'},
      {value: 'Maintenance Slip'},
      {value: 'Property Tax'},
      {value: 'Water Bill'},
    ],
    key: 'pop_electricity3',
    res: {},
  },
];

const freshPopListBuild = [
  {
    enable: true,
    value: '',
    options: [{value: 'Cost Sheet'}, {value: 'Blue Print'}, {value: 'CC Copy'}],
    key: 'pop_electricity',
    res: {},
  },
  {
    enable: false,
    value: '',
    options: [{value: 'Cost Sheet'}, {value: 'Blue Print'}, {value: 'CC Copy'}],
    key: 'pop_electricity1',
    res: {},
  },
  {
    enable: false,
    value: '',
    options: [{value: 'Cost Sheet'}, {value: 'Blue Print'}, {value: 'CC Copy'}],
    key: 'pop_electricity2',
    res: {},
  },
];

const freshPopListResale = [
  {
    enable: true,
    value: '',
    options: [
      {value: 'Chain of Agreement'},
      {value: 'Society Registration'},
      {value: 'Share Certificate'},
      {value: 'Maintenance Slip'},
      {value: 'Property Tax'},
      {value: 'OC Copy'},
      {value: 'Water Bill'},
    ],
    key: 'pop_electricity',
    res: {},
  },
  {
    enable: false,
    value: '',
    options: [
      {value: 'Chain of Agreement'},
      {value: 'Society Registration'},
      {value: 'Share Certificate'},
      {value: 'Maintenance Slip'},
      {value: 'Property Tax'},
      {value: 'OC Copy'},
      {value: 'Water Bill'},
    ],
    key: 'pop_electricity1',
    res: {},
  },
  {
    enable: false,
    value: '',
    options: [
      {value: 'Chain of Agreement'},
      {value: 'Society Registration'},
      {value: 'Share Certificate'},
      {value: 'Maintenance Slip'},
      {value: 'Property Tax'},
      {value: 'OC Copy'},
      {value: 'Water Bill'},
    ],
    key: 'pop_electricity2',
    res: {},
  },
  {
    enable: false,
    value: '',
    options: [
      {value: 'Chain of Agreement'},
      {value: 'Society Registration'},
      {value: 'Share Certificate'},
      {value: 'Maintenance Slip'},
      {value: 'Property Tax'},
      {value: 'OC Copy'},
      {value: 'Water Bill'},
    ],
    key: 'pop_electricity3',
    res: {},
  },
  {
    enable: false,
    value: '',
    options: [
      {value: 'Chain of Agreement'},
      {value: 'Society Registration'},
      {value: 'Share Certificate'},
      {value: 'Maintenance Slip'},
      {value: 'Property Tax'},
      {value: 'OC Copy'},
      {value: 'Water Bill'},
    ],
    key: 'pop_electricity4',
    res: {},
  },
  {
    enable: false,
    value: '',
    options: [
      {value: 'Chain of Agreement'},
      {value: 'Society Registration'},
      {value: 'Share Certificate'},
      {value: 'Maintenance Slip'},
      {value: 'Property Tax'},
      {value: 'OC Copy'},
      {value: 'Water Bill'},
    ],
    key: 'pop_electricity5',
    res: {},
  },
  {
    enable: false,
    value: '',
    options: [
      {value: 'Chain of Agreement'},
      {value: 'Society Registration'},
      {value: 'Share Certificate'},
      {value: 'Maintenance Slip'},
      {value: 'Property Tax'},
      {value: 'OC Copy'},
      {value: 'Water Bill'},
    ],
    key: 'pop_electricity6',
    res: {},
  },
];

export default class FileUploadForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.findFileName = this.findFileName.bind(this);
    this.fileselected = this.fileselected.bind(this);
    this.renderpop = this.renderpop.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      restoreFileList:{},
      fileList: [],
      multipleFilesList: listoffiles,
      exisitng_loan_doc: '',
      current_add_proof: '',
      proof_of_property: '',
      proofOfProprtyList1: [],
      proofOfProprtyList2: [],
      proofOfProprtyList3: [],
      proofOfProprtyList4: [],
      proofOfProprtyList5: [],
      proofOfProprtyList6: [],
      proof_of_property1: '',
      proof_of_property2: '',
      proof_of_property3: '',
      proof_of_property4: '',
      proof_of_property5: '',
      proof_of_property6: '',
      existingcard: '',
      fresh_pop: '',
      popitemList: lapPopList,
    };
    // const {title} = props;
    // proofOfProprtyList = title.includes('Home')
    //   ? [
    //       {value: 'Share Certificate'},
    //       {value: 'Maintenance Slip'},
    //       {value: 'Property Tax'},
    //       {value: 'Water Bill'},
    //     ]
    //   : [
    //       {
    //         value: `Electricity Bill`,
    //       },
    //       {
    //         value: `Society Maintenance Bill`,
    //       },
    //       {
    //         value: `Water Bill`,
    //       },
    //     ];
  }

  optionsSelected = (item, index, value) => {
    const {popitemList} = this.state;
    //const current  = popitemList[index];
    const filter = Lodash.filter(item.options, (io) => io.value === value);
    item.options = filter;
    item.value = value;
    popitemList[index] = item;
    const nextpos = index + 1;
    if (nextpos < popitemList.length) {
      const next = popitemList[nextpos];
      const nextoptions = next.options;
      for (let i = 0; i < popitemList.length; i++) {
        const elmet = popitemList[i];
        if (elmet.value != '') {
          const find = Lodash.findLastIndex(
            nextoptions,
            (io) => io.value === elmet.value,
          );
          if (find !== -1) {
            nextoptions.splice(find, 1);
          }
        }
      }
      next.options = nextoptions;
      next.enable = true;
      popitemList[nextpos] = next;
    }
    this.setState({popitemList: popitemList}, () => this.forceUpdate());
  };

  renderpop = (item, index) => {
    const {mode} = this.props;
    return (
      <View style={styles.popcont}>
        {item.enable ? (
          <View style={{flex: 0.4}}>
            <NewDropDown
              truncate
              list={item.options}
              placeholder={'Select One'}
              value={item.value}
              selectedItem={(value) => this.optionsSelected(item, index, value)}
              style={styles.newdropdowncontainers}
              textStyle={styles.newdropdowntextstyle}
            />
          </View>
        ) : null}

        <View style={{flex: 0.57}}>
          {item.value != '' ? (
            <CommonFileUpload
              mode={mode}
              title={``}
              type={2}
              keyName={item.key}
              pickedTitle={this.findFileName(item.key)}
              pickedCallback={(selected, res) =>
                this.fileselected(res, item.key, -1, false, -1)
              }
              enableDownloads={this.checkurl(
                0,
                this.state.multipleFilesList[18].downloadUrl[index],
              )}
              downloadUrl={this.checkurl(
                1,
                this.state.multipleFilesList[18].downloadUrl[index],
              )}
            />
          ) : null}
        </View>
      </View>
    );
  };

  restoreData(obj) {
    const {title, fresh_pop} = this.props;
    //console.log(obj);
    if (obj !== null && obj !== undefined) {
      // var popitemList = [];
      // if (obj.fresh_pop !== undefined && obj.fresh_pop === 'Builder Purchase') {
      //   popitemList = freshPopListBuild;
      // } else if (
      //   obj.fresh_pop !== undefined &&
      //   obj.fresh_pop === 'Resale Property'
      // ) {
      //   popitemList = freshPopListResale;
      // }
      // obj.popitemList = popitemList;
      this.setuppop(
        Helper.nullCheck(obj.multipleFilesList) === false
          ? obj.multipleFilesList
          : [],
        Helper.nullStringCheckWithReturn(obj.exisitng_loan_doc),
        Helper.nullStringCheckWithReturn(obj.current_add_proof),
        Helper.nullStringCheckWithReturn(obj.proof_of_property),
        Helper.nullStringCheckWithReturn(obj.existingcard),
        Helper.nullStringCheckWithReturn(obj.fresh_pop),
        Helper.nullCheck(obj.popitemList) === false ? obj.popitemList : [],
      );
      this.setState(obj, () => this.forceUpdate());
    }
  }

  componentDidMount() {
    // const {title} = this.props;
    // proofOfProprtyList = title.includes('Home')
    //   ? [
    //       {value: 'Share Certificate'},
    //       {value: 'Maintenance Slip'},
    //       {value: 'Property Tax'},
    //       {value: 'Water Bill'},
    //     ]
    //   : [
    //       {
    //         value: `Electricity Bill`,
    //       },
    //       {
    //         value: `Society Maintenance Bill`,
    //       },
    //       {
    //         value: `Water Bill`,
    //       },
    //     ];

    const {
      multipleFilesList = listoffiles,
      exisitng_loan_doc = '',
      current_add_proof = '',
      proof_of_property = '',
      existingcard = '',
      fresh_pop = '',
      popitemList = [],
    } = this.props;
    //console.log('didmount', popitemList,fresh_pop);
    this.setuppop(
      multipleFilesList,
      exisitng_loan_doc,
      current_add_proof,
      proof_of_property,
      existingcard,
      fresh_pop,
      popitemList,
    );
    //console.log(filterList);
  }

  setuppop = (
    multipleFilesList = listoffiles,
    exisitng_loan_doc = '',
    current_add_proof = '',
    proof_of_property = '',
    existingcard = '',
    fresh_pop = '',
    popitemList = [],
  ) => {
    const {title} = this.props;
    var filterList = listoffiles;
    var proofOfProprtyList1 = [];
    var proofOfProprtyList2 = [];
    var proofOfProprtyList3 = [];
    var proofOfProprtyList4 = [];
    var proofOfProprtyList5 = [];
    var proofOfProprtyList6 = [];
    let spx = [];

    var newpopitemList = [];

    if (popitemList.length === 0) {
      if (title.includes('Against')) {
        newpopitemList = lapPopList;
      } else {
        if (Helper.nullStringCheck(fresh_pop) === false) {
          if (fresh_pop.toLowerCase() === 'builder purchase') {
            newpopitemList = freshPopListBuild;
          } else {
            newpopitemList = freshPopListResale;
          }
        } else if (Helper.nullStringCheck(existingcard) === false) {
          if (existingcard.toLowerCase() === 'yes') {
            newpopitemList = btpopList;
          }
        } else {
          newpopitemList = lapPopList;
        }
      }
    } else {
      newpopitemList = popitemList;
    }

    if (
      Helper.nullCheck(multipleFilesList) === false &&
      multipleFilesList.length > 0
    ) {
      filterList = Lodash.map(multipleFilesList, (io) => {
        const {downloadUrl} = io;
        let isproof = false;
        const filters = Lodash.filter(downloadUrl, (file) => {
          if (Helper.extCheckReg(file)) {
            if (file.includes('pop_electricity')) {
              isproof = true;
            }
            return file;
          }
        });
        if (isproof === false && filters.length > 0) {
          filters.splice(0, 1);
        }
        io.downloadUrl = filters;
        io.filled = new Array(filters.length).fill(1, 0, filters.length);
        io.count = io.filled.length;
        return io;
      });
    }
    // if (
    //   Helper.nullStringCheck(proof_of_property) === false &&
    //   Helper.separatorReg(proof_of_property)
    // ) {
    //   spx = proof_of_property.split(',').filter(io => io !== '');
    //   if (spx.length > 0) {
    //     const cloneList = JSON.parse(JSON.stringify(proofOfProprtyList));
    //     proofOfProprtyList = [];
    //     for (let j = 0; j < cloneList.length; j++) {
    //       const el = cloneList[j];
    //       if (el.value === spx[0]) {
    //         proofOfProprtyList.push(el);
    //       } else {
    //         proofOfProprtyList1.push(el);
    //       }
    //       if (el.value === spx[0] || el.value === spx[1]) {
    //       } else {
    //         proofOfProprtyList2.push(el);
    //         const ind = proofOfProprtyList1.findIndex(
    //           io => io.value == el.value,
    //         );
    //         if (ind !== -1) {
    //           proofOfProprtyList1.splice(ind, 1);
    //         }
    //       }
    //     }
    //   }
    // }

    //console.log('newpopitemList', newpopitemList);

    //console.log(filterList[18].downloadUrl);

    console.log('existingcard', existingcard);

    this.setState(
      {
        popitemList: newpopitemList,
        multipleFilesList: filterList,
        existingcard: existingcard,
        exisitng_loan_doc: exisitng_loan_doc,
        current_add_proof: current_add_proof,
        // proof_of_property: spx.length > 0 ? spx[0] : '',
        // proof_of_property1: spx.length > 1 ? spx[1] : '',
        // proof_of_property2: spx.length > 2 ? spx[2] : '',
        // proof_of_property3: spx.length > 3 ? spx[3] : '',
        // proof_of_property4: spx.length > 4 ? spx[4] : '',
        // proof_of_property5: spx.length > 5 ? spx[5] : '',
        // proof_of_property6: spx.length > 6 ? spx[6] : '',
        // proofOfProprtyList1: proofOfProprtyList1,
        // proofOfProprtyList2: proofOfProprtyList2,
      },
      () => this.forceUpdate(),
    );

    // if (Helper.nullStringCheck(existingcard) === false)
    //   this.setState({existingcard: existingcard});

    // if (Helper.nullStringCheck(exisitng_loan_doc) === false)
    //   this.setState({exisitng_loan_doc: exisitng_loan_doc});

    // if (Helper.nullStringCheck(current_add_proof) === false)
    //   this.setState({current_add_proof: current_add_proof});

    // if (Helper.nullStringCheck(proofofproperty) === false)
    //   this.setState({
    //     proof_of_property: proofofproperty,
    //     proofOfProprtyList1: proofOfProprtyList1,
    //   });

    // if (Helper.nullStringCheck(proof_of_property2) === false)
    //   this.setState({proof_of_property2: proof_of_property2});

    // if (Helper.nullStringCheck(proof_of_property1) === false)
    //   this.setState({
    //     proof_of_property1: proof_of_property1,
    //     proofOfProprtyList2: proofOfProprtyList2,
    //   });
  };

  findFileName = (input) => {
    //console.log('input', input);
    const {fileList} = this.state;
    if (Helper.nullStringCheck(input) === false && fileList.length > 0) {
      let find = Lodash.find(fileList, (io) => {
        if (Helper.nullCheck(io[input]) === false) {
          return io[input];
        } else {
          return undefined;
        }
      });
      return find !== undefined ? find[input].name : '';
    } else {
      return '';
    }
  };

  onChange = (event, selectDate) => {
    this.setState({showCalendar: false, currentDate: selectDate});
  };

  checkurl = (type, name) => {
    const exist = Helper.extCheckReg(name);
    if (type === 0) {
      return exist ? true : false;
    } else {
      return exist ? name : '';
    }
  };

  mandatoryName = (name, title) => {
    //return `${name} ${title === 'Auto Loan' || title === 'Business Loan' || title === 'Personal Loan' ? ` *` : ``}`;
    return `${name}`;
  };

  insertValueFormultipleFilePick = (position) => {
    const {multipleFilesList} = this.state;
    const oldercount = multipleFilesList[position].count;
    if (oldercount < Pref.MAX_FILE_PICK_LIMIT) {
      const increment = oldercount + 1;
      multipleFilesList[position].count = increment;
      const emptyArray = new Array(increment).fill(1, 0, increment);
      multipleFilesList[position].filled = emptyArray;
      this.setState({multipleFilesList: multipleFilesList}, () => {
        this.forceUpdate();
      });
    } else {
      Helper.showToastMessage('You can select upto 6 files', 0);
    }
  };

  removeValueFormultipleFilePick = (position, index) => {
    const {multipleFilesList} = this.state;
    const oldercount = multipleFilesList[position].count;
    multipleFilesList[position].filled.splice(index, 1);
    multipleFilesList[position].count = oldercount - 1;
    this.setState({multipleFilesList: multipleFilesList}, () => {
      this.forceUpdate();
    });
  };

  fileselected = (res, key, index, withIndex = false, arrayPosition = -1) => {
    let obj = {};
    let findPositionExisting = -1;
    let name = res.name;
    if (withIndex) {
      obj[`${key}${index + 1}`] = res;
      findPositionExisting = this.state.fileList.findIndex(
        (io) => io[`${key}${index + 1}`],
      );
    } else {
      obj[`${key}`] = res;
      findPositionExisting = this.state.fileList.findIndex(
        (io) => io[`${key}`],
      );
    }
    if (findPositionExisting !== -1) {
      this.state.fileList.splice(findPositionExisting);
    }
    if (arrayPosition !== -1 && index !== -1) {
      this.state.multipleFilesList[arrayPosition].names[index] = name;
    }
    this.state.fileList.push(obj);
  };

  renderSelectedMultiChoice = (
    selectedItems = '',
    checkKey = '',
    title = '',
    key = '',
    arrayposition,
    firstItemUrl,
  ) => {
    const {
      mode = false,
      downloadTitles = '',
      truDownloadEnable = -1,
      editMode = false,
    } = this.props;

    if (Helper.nullStringCheck(selectedItems) === true) {
      return null;
    }

    return (
      <>
        <CommonFileUpload
          showPlusIcon={true}
          truDownloadEnable={truDownloadEnable}
          downloadTitles={downloadTitles}
          mode={mode}
          title={title}
          type={2}
          keyName={key}
          pickedTitle={this.findFileName(key)}
          pickedCallback={(selected, res) =>
            this.fileselected(res, key, -1, false, -1)
          }
          enableDownloads={this.checkurl(0, firstItemUrl)}
          downloadUrl={this.checkurl(1, firstItemUrl)}
          plusClicked={() => this.insertValueFormultipleFilePick(arrayposition)}
        />

        {this.state.multipleFilesList &&
          this.state.multipleFilesList[arrayposition].filled.map((e, index) => {
            const durl = this.state.multipleFilesList[arrayposition]
              .downloadUrl;
            const namesList = this.state.multipleFilesList[arrayposition].names;
            return (
              <CommonFileUpload
                minusClicked={() =>
                  this.removeValueFormultipleFilePick(arrayposition, index)
                }
                showMinusIcon={true}
                pickedTitle={namesList[index]}
                //editMode={editMode}
                downloadTitles={downloadTitles}
                truDownloadEnable={truDownloadEnable}
                mode={mode}
                title={`${title} ${index + 2}`}
                keyName={key}
                type={2}
                pickedCallback={(selected, res) =>
                  this.fileselected(res, key, index, true, arrayposition)
                }
                enableDownloads={this.checkurl(0, durl[index])}
                downloadUrl={this.checkurl(1, durl[index])}
              />
            );
          })}
      </>
    );
  };

  render() {
    const {
      panCard = null,
      title,
      cancelChq = null,
      aadharCard = null,
      gstImage = null,
      headerchange = false,
      rcCopy = null,
      oldInsCopy = null,
      puccopy = null,
      salarySlip = null,
      salarySlip1 = null,
      salarySlip2 = null,
      salarySlip3 = null,
      salarySlip4 = null,
      salarySlip5 = null,
      bankState = null,
      policycopy = null,
      mode = false,
      downloadTitles = '',
      truDownloadEnable = -1,

      editMode = false,
      existing = null,
      other = null,
      cap_aadhar = null,
      cap_passport = null,
      cap_rent_agreement = null,
      cap_licence = null,
      cap_voterid = null,
      cap_postpaid = null,
      pop_index_bill = null,
      pop_water_bill = null,
      statement_of_accounts = null,
      sanction_letter = null,
      cap_electricity = null,
      cap_landline = null,
      pop_electricity = null,
      current_loan_repayment_statement = null,
      credit_card_front_copy = null,
      passportPhoto = null,
      card_statement = null,
      quotes = null,
      policy = null,
      cif = null,
      quoteEmailClicked = () => {},
      quoteWhatsappClicked = () => {},
      cifWhatsappClicked = () => {},
      cifEmailClicked = () => {},
      itrdoc = null,
      employ = '',
      tmpPolicy = null,     
    } = this.props;

    const {
      exisitng_loan_doc,
      proof_of_property,
      current_add_proof,
    } = this.state;

    const loanCheck =
      Helper.nullStringCheck(title) === false &&
      (title === 'Business Loan' ||
        title === 'Personal Loan' ||
        title === 'Loan Against Property' ||
        title === 'Home Loan' ||
        title === 'Auto Loan' ||
        title === 'Gold Loan' ||
        title === 'Health Insurance' ||
        title === 'Credit Card')
        ? true
        : false;

    return (
      <View>
        {truDownloadEnable !== -1 && quotes !== null ? (
          <CommonFileUpload
            truDownloadEnable={truDownloadEnable}
            downloadTitles={downloadTitles}
            mode={mode}
            title={`Quotes`}
            type={2}
            enableDownloads={this.checkurl(0, quotes)}
            downloadUrl={this.checkurl(1, quotes)}
            email
            emailClicked={quoteEmailClicked}
            whatsapp
            whatsppClicked={quoteWhatsappClicked}
          />
        ) : null}
        {truDownloadEnable !== -1 && cif !== null ? (
          <CommonFileUpload
            truDownloadEnable={truDownloadEnable}
            downloadTitles={downloadTitles}
            mode={mode}
            title={`CIF`}
            type={2}
            email
            emailClicked={cifEmailClicked}
            whatsapp
            whatsppClicked={cifWhatsappClicked}
            enableDownloads={this.checkurl(0, cif)}
            downloadUrl={this.checkurl(1, cif)}
          />
        ) : null}
        {truDownloadEnable !== -1 && policy !== null ? (
          <CommonFileUpload
            truDownloadEnable={truDownloadEnable}
            downloadTitles={downloadTitles}
            mode={mode}
            title={`Policy`}
            type={2}
            enableDownloads={this.checkurl(0, policy)}
            downloadUrl={this.checkurl(1, policy)}
          />
        ) : null}
        {loanCheck ? (
          <>
            {truDownloadEnable === -1 &&
            title !== 'Health Insurance' &&
            title !== 'Credit Card' ? (
              <NewDropDown
                list={currentAddressProofList}
                placeholder={'Select Residence Proof'}
                value={this.state.current_add_proof}
                selectedItem={(value) =>
                  this.setState({current_add_proof: value})
                }
                style={styles.newdropdowncontainers}
                textStyle={styles.newdropdowntextstyle}
              />
            ) : null}

            {this.renderSelectedMultiChoice(
              current_add_proof,
              'Aadhar',
              'Current Address Proof',
              'cap_aadhar',
              10,
              cap_aadhar,
            )}

            {this.state.existingcard === 'Yes' &&
            title !== 'Gold Loan' &&
            title !== 'Health Insurance' &&
            title !== 'Credit Card' ? (
              <>
                {truDownloadEnable === -1 ? (
                  <NewDropDown
                    list={existingLoanDocumentList}
                    placeholder={'Existing Loan Document'}
                    value={this.state.exisitng_loan_doc}
                    selectedItem={(value) =>
                      this.setState({exisitng_loan_doc: value})
                    }
                    style={styles.newdropdowncontainers}
                    textStyle={styles.newdropdowntextstyle}
                  />
                ) : null}

                {this.renderSelectedMultiChoice(
                  exisitng_loan_doc,
                  'Current',
                  'Existing Loan Document',
                  'current_loan_repayment_statement',
                  21,
                  current_loan_repayment_statement,
                )}
              </>
            ) : null}

            {title === 'Home Loan' || title === 'Loan Against Property' ? (
              <>
                {truDownloadEnable !== -1 ? (
                  <View>
                    <CommonFileUpload
                      truDownloadEnable={truDownloadEnable}
                      downloadTitles={downloadTitles}
                      mode={mode}
                      title={`Proof Of Property 1`}
                      type={2}
                      keyName={'pop_electricity'}
                      pickedTitle={this.findFileName('pop_electricity')}
                      pickedCallback={(selected, res) =>
                        this.fileselected(res, 'pop_electricity', -1, false, -1)
                      }
                      enableDownloads={this.checkurl(0, pop_electricity)}
                      downloadUrl={this.checkurl(1, pop_electricity)}
                    />

                    <CommonFileUpload
                      truDownloadEnable={truDownloadEnable}
                      downloadTitles={downloadTitles}
                      mode={mode}
                      title={`Proof Of Property 2`}
                      type={2}
                      keyName={'pop_electricity1'}
                      pickedTitle={this.findFileName('pop_electricity1')}
                      pickedCallback={(selected, res) =>
                        this.fileselected(
                          res,
                          'pop_electricity1',
                          -1,
                          false,
                          -1,
                        )
                      }
                      enableDownloads={this.checkurl(
                        0,
                        this.state.multipleFilesList[18].downloadUrl[0],
                      )}
                      downloadUrl={this.checkurl(
                        1,
                        this.state.multipleFilesList[18].downloadUrl[0],
                      )}
                    />

                    <CommonFileUpload
                      truDownloadEnable={truDownloadEnable}
                      downloadTitles={downloadTitles}
                      mode={mode}
                      title={`Proof Of Property 3`}
                      type={2}
                      keyName={'pop_electricity2'}
                      pickedTitle={this.findFileName('pop_electricity2')}
                      pickedCallback={(selected, res) =>
                        this.fileselected(
                          res,
                          'pop_electricity2',
                          -1,
                          false,
                          -1,
                        )
                      }
                      enableDownloads={this.checkurl(
                        0,
                        this.state.multipleFilesList[18].downloadUrl[1],
                      )}
                      downloadUrl={this.checkurl(
                        1,
                        this.state.multipleFilesList[18].downloadUrl[1],
                      )}
                    />

                    <CommonFileUpload
                      truDownloadEnable={truDownloadEnable}
                      downloadTitles={downloadTitles}
                      mode={mode}
                      title={`Proof Of Property 4`}
                      type={2}
                      keyName={'pop_electricity3'}
                      pickedTitle={this.findFileName('pop_electricity3')}
                      pickedCallback={(selected, res) =>
                        this.fileselected(
                          res,
                          'pop_electricity3',
                          -1,
                          false,
                          -1,
                        )
                      }
                      enableDownloads={this.checkurl(
                        0,
                        this.state.multipleFilesList[18].downloadUrl[2],
                      )}
                      downloadUrl={this.checkurl(
                        1,
                        this.state.multipleFilesList[18].downloadUrl[2],
                      )}
                    />

                    <CommonFileUpload
                      truDownloadEnable={truDownloadEnable}
                      downloadTitles={downloadTitles}
                      mode={mode}
                      title={`Proof Of Property 5`}
                      type={2}
                      keyName={'pop_electricity4'}
                      pickedTitle={this.findFileName('pop_electricity4')}
                      pickedCallback={(selected, res) =>
                        this.fileselected(
                          res,
                          'pop_electricity4',
                          -1,
                          false,
                          -1,
                        )
                      }
                      enableDownloads={this.checkurl(
                        0,
                        this.state.multipleFilesList[18].downloadUrl[3],
                      )}
                      downloadUrl={this.checkurl(
                        1,
                        this.state.multipleFilesList[18].downloadUrl[3],
                      )}
                    />

                    <CommonFileUpload
                      truDownloadEnable={truDownloadEnable}
                      downloadTitles={downloadTitles}
                      mode={mode}
                      title={`Proof Of Property 6`}
                      type={2}
                      keyName={'pop_electricity5'}
                      pickedTitle={this.findFileName('pop_electricity5')}
                      pickedCallback={(selected, res) =>
                        this.fileselected(
                          res,
                          'pop_electricity5',
                          -1,
                          false,
                          -1,
                        )
                      }
                      enableDownloads={this.checkurl(
                        0,
                        this.state.multipleFilesList[18].downloadUrl[4],
                      )}
                      downloadUrl={this.checkurl(
                        1,
                        this.state.multipleFilesList[18].downloadUrl[4],
                      )}
                    />

                    <CommonFileUpload
                      truDownloadEnable={truDownloadEnable}
                      downloadTitles={downloadTitles}
                      mode={mode}
                      title={`Proof Of Property 7`}
                      type={2}
                      keyName={'pop_electricity6'}
                      pickedTitle={this.findFileName('pop_electricity6')}
                      pickedCallback={(selected, res) =>
                        this.fileselected(
                          res,
                          'pop_electricity6',
                          -1,
                          false,
                          -1,
                        )
                      }
                      enableDownloads={this.checkurl(
                        0,
                        this.state.multipleFilesList[18].downloadUrl[5],
                      )}
                      downloadUrl={this.checkurl(
                        1,
                        this.state.multipleFilesList[18].downloadUrl[5],
                      )}
                    />
                  </View>
                ) : (
                  <View>
                    <Title
                      style={StyleSheet.flatten([
                        styles.title2,
                        {
                          marginVertical: 8,
                          color: Pref.RED,
                          fontSize: 14,
                          paddingVertical: 4,
                        },
                      ])}>{`Select Proof Of Property`}</Title>

                    {/*<View style={styles.popcont}>
                      <View style={{flex: 0.4}}>
                        <NewDropDown
                          truncate
                          list={proofOfProprtyList}
                          placeholder={'Select One'}
                          value={this.state.proof_of_property}
                          selectedItem={value => {
                            const proofOfProprtyList1 = Lodash.filter(
                              proofOfProprtyList,
                              io => io.value !== value,
                            );
                            this.setState({
                              proof_of_property: value,
                              proofOfProprtyList1: proofOfProprtyList1,
                            });
                          }}
                          style={StyleSheet.flatten([
                            styles.newdropdowncontainers,
                          ])}
                          textStyle={styles.newdropdowntextstyle}
                        />
                      </View>

                      {this.state.proof_of_property !== '' ? (
                        <View style={{flex: 0.6}}>
                          <CommonFileUpload
                            truDownloadEnable={truDownloadEnable}
                            downloadTitles={downloadTitles}
                            mode={mode}
                            title={``}
                            type={2}
                            keyName={'pop_electricity'}
                            pickedTitle={this.findFileName('pop_electricity')}
                            pickedCallback={(selected, res) =>
                              this.fileselected(
                                res,
                                'pop_electricity',
                                -1,
                                false,
                                -1,
                              )
                            }
                            enableDownloads={this.checkurl(0, pop_electricity)}
                            downloadUrl={this.checkurl(1, pop_electricity)}
                          />
                        </View>
                      ) : null}
                    </View>

                     {this.state.proof_of_property !== '' &&
                    this.state.proofOfProprtyList1.length > 0 ? (
                      <View style={styles.popcont}>
                        <View style={{flex: 0.4}}>
                          <NewDropDown
                            truncate
                            list={this.state.proofOfProprtyList1}
                            placeholder={'Select One'}
                            value={this.state.proof_of_property1}
                            selectedItem={value => {
                              const proofOfProprtyList2 = Lodash.filter(
                                this.state.proofOfProprtyList1,
                                io =>
                                  io.value !== value &&
                                  io.value !== this.state.proof_of_property,
                              );
                              const ind = this.state.proofOfProprtyList1.findIndex(
                                io => io.value == value,
                              );
                              if (ind !== -1) {
                                this.state.proofOfProprtyList1.splice(ind, 1);
                              }
                              this.setState({
                                proof_of_property1: value,
                                proofOfProprtyList1: this.state
                                  .proofOfProprtyList1,
                                proofOfProprtyList2: proofOfProprtyList2,
                              });
                            }}
                            style={styles.newdropdowncontainers}
                            textStyle={styles.newdropdowntextstyle}
                          />
                        </View>

                        <View style={{flex: 0.6}}>
                          {this.state.proof_of_property1 !== '' &&
                          this.state.proofOfProprtyList1.length > 0 ? (
                            <CommonFileUpload
                              truDownloadEnable={truDownloadEnable}
                              downloadTitles={downloadTitles}
                              mode={mode}
                              title={``}
                              type={2}
                              keyName={'pop_electricity1'}
                              pickedTitle={this.findFileName(
                                'pop_electricity1',
                              )}
                              pickedCallback={(selected, res) =>
                                this.fileselected(
                                  res,
                                  'pop_electricity1',
                                  -1,
                                  false,
                                  -1,
                                )
                              }
                              enableDownloads={this.checkurl(
                                0,
                                this.state.multipleFilesList[18].downloadUrl[0],
                              )}
                              downloadUrl={this.checkurl(
                                1,
                                this.state.multipleFilesList[18].downloadUrl[0],
                              )}
                            />
                          ) : null}
                        </View>
                      </View>
                    ) : null}

                    {this.state.proof_of_property1 !== '' &&
                    this.state.proofOfProprtyList2.length > 0 ? (
                      <View style={styles.popcont}>
                        <View style={{flex: 0.4}}>
                          <NewDropDown
                            truncate
                            list={this.state.proofOfProprtyList2}
                            placeholder={'Select One'}
                            value={this.state.proof_of_property2}
                            selectedItem={value => {
                              if (this.state.existingcard === 'Yes') {
                                this.setState({proof_of_property2: value});
                              } else {
                                const proofOfProprtyList3 = Lodash.filter(
                                  this.state.proofOfProprtyList2,
                                  io =>
                                    io.value !== value &&
                                    io.value !== this.state.proof_of_property &&
                                    io.value !== this.state.proof_of_property1,
                                );
                                const ind = this.state.proofOfProprtyList1.findIndex(
                                  io => io.value == value,
                                );
                                if (ind !== -1) {
                                  this.state.proofOfProprtyList1.splice(ind, 1);
                                }
                                const ind1 = this.state.proofOfProprtyList2.findIndex(
                                  io => io.value == value,
                                );
                                if (ind1 !== -1) {
                                  this.state.proofOfProprtyList2.splice(
                                    ind1,
                                    1,
                                  );
                                }
                                this.setState({
                                  proof_of_property2: value,
                                  proofOfProprtyList1: this.state
                                    .proofOfProprtyList1,
                                  proofOfProprtyList2: this.state
                                    .proofOfProprtyList2,
                                  proofOfProprtyList3: proofOfProprtyList3,
                                });
                              }
                            }}
                            style={styles.newdropdowncontainers}
                            textStyle={styles.newdropdowntextstyle}
                          />
                        </View>

                        <View style={{flex: 0.6}}>
                          {this.state.proof_of_property2 !== '' &&
                          this.state.proofOfProprtyList2.length > 0 ? (
                            <CommonFileUpload
                              truDownloadEnable={truDownloadEnable}
                              downloadTitles={downloadTitles}
                              mode={mode}
                              title={``}
                              type={2}
                              keyName={'pop_electricity2'}
                              pickedTitle={this.findFileName(
                                'pop_electricity2',
                              )}
                              pickedCallback={(selected, res) =>
                                this.fileselected(
                                  res,
                                  'pop_electricity2',
                                  -1,
                                  false,
                                  -1,
                                )
                              }
                              enableDownloads={this.checkurl(
                                0,
                                this.state.multipleFilesList[18].downloadUrl[1],
                              )}
                              downloadUrl={this.checkurl(
                                1,
                                this.state.multipleFilesList[18].downloadUrl[1],
                              )}
                            />
                          ) : null}
                        </View>
                      </View>
                    ) : null} */}

                    <FlatList
                      data={this.state.popitemList}
                      keyExtractor={(item, index) => `${index}`}
                      renderItem={({item, index}) =>
                        this.renderpop(item, index)
                      }
                    />
                  </View>
                )}
              </>
            ) : null}
            {title !== 'Gold Loan' &&
            title !== 'Health Insurance' &&
            title !== 'Credit Card' ? (
              <CommonFileUpload
                truDownloadEnable={truDownloadEnable}
                title={'Passport Size Photo'}
                type={2}
                keyName={'passport_photo'}
                pickedTitle={this.findFileName(`passport_photo`)}
                pickedCallback={(selected, res) =>
                  this.fileselected(res, 'passport_photo', -1, false, -1)
                }
                enableDownloads={this.checkurl(0, passportPhoto)}
                downloadUrl={this.checkurl(1, passportPhoto)}
                mode={mode}
                downloadTitles={downloadTitles}
              />
            ) : null}
          </>
        ) : null}

        {title !== 'TMP' && title !== 'Motor Insurance' ||
        title === 'Health Insurance' ||
        title === 'Credit Card' ? (
          <>
            <CommonFileUpload
              //showPlusIcon={title !== 'Profile'}
              showPlusIcon={loanCheck}
              truDownloadEnable={truDownloadEnable}
              downloadTitles={downloadTitles}
              mode={mode}
              title={`${this.mandatoryName(`Pan Card`, title)} ${
                truDownloadEnable === 1 ? '1' : ''
              }`}
              type={2}
              pickedTitle={this.findFileName(`pancard`)}
              pickedCallback={(selected, res) =>
                this.fileselected(res, 'pancard', -1, false, -1)
              }
              enableDownloads={this.checkurl(0, panCard)}
              downloadUrl={this.checkurl(1, panCard)}
              plusClicked={() => this.insertValueFormultipleFilePick(0)}
              keyName={'pancard'}
            />

            {loanCheck &&
              this.state.multipleFilesList &&
              this.state.multipleFilesList[0].filled.map((e, index) => {
                const durl = this.state.multipleFilesList[0].downloadUrl;
                const namesList = this.state.multipleFilesList[0].names;

                return (
                  <CommonFileUpload
                    minusClicked={() =>
                      this.removeValueFormultipleFilePick(0, index)
                    }
                    showMinusIcon={true}
                    //editMode={editMode}
                    truDownloadEnable={truDownloadEnable}
                    downloadTitles={downloadTitles}
                    mode={mode}
                    title={`Pan Card ${index + 2}`}
                    keyName={`pancard${index + 1}`}
                    type={2}
                    pickedTitle={namesList[index]}
                    pickedCallback={(selected, res) =>
                      this.fileselected(res, 'pancard', index, true, 0)
                    }
                    enableDownloads={this.checkurl(0, durl[index])}
                    downloadUrl={this.checkurl(1, durl[index])}
                  />
                );
              })}

            <CommonFileUpload
              showPlusIcon={loanCheck}
              truDownloadEnable={truDownloadEnable}
              //title={'Aadhar Card'}
              title={`${this.mandatoryName(
                title === 'Demat' ? `Address Proof` : `Aadhar Card`,
                title,
              )} ${truDownloadEnable === 1 ? '1' : ''}`}
              // title={`Aadhar Card ${title === 'Auto Loan' || title === 'Business Loan' || title === 'Personal Loan' ? ` *` : ``}`}
              type={2}
              pickedTitle={this.findFileName(
                title === 'Demat' ? `addressproof` : `aadharcard`,
              )}
              pickedCallback={(selected, res) =>
                this.fileselected(
                  res,
                  title === 'Demat' ? 'addressproof' : 'aadharcard',
                  -1,
                  false,
                  -1,
                )
              }
              enableDownloads={this.checkurl(0, aadharCard)}
              downloadUrl={this.checkurl(1, aadharCard)}
              mode={mode}
              downloadTitles={downloadTitles}
              plusClicked={() => this.insertValueFormultipleFilePick(1)}
              keyName={title === 'Demat' ? 'addressproof' : 'aadharcard'}
            />

            {loanCheck &&
              this.state.multipleFilesList &&
              this.state.multipleFilesList[1].filled.map((e, index) => {
                const durl = this.state.multipleFilesList[1].downloadUrl;
                return (
                  <CommonFileUpload
                    minusClicked={() =>
                      this.removeValueFormultipleFilePick(1, index)
                    }
                    showMinusIcon={true}
                    //editMode={editMode}
                    downloadTitles={downloadTitles}
                    title={`${
                      title === 'Demat' ? 'Address Proof' : 'Aadhar Card'
                    } ${index + 2}`}
                    truDownloadEnable={truDownloadEnable}
                    mode={mode}
                    type={2}
                    keyName={
                      title === 'Demat'
                        ? `addressproof${index + 1}`
                        : `aadharcard${index + 1}`
                    }
                    pickedTitle={this.findFileName(
                      title === 'Demat'
                        ? `addressproof${index + 1}`
                        : `aadharcard${index + 1}`,
                    )}
                    pickedCallback={(selected, res) =>
                      this.fileselected(
                        res,
                        title === 'Demat' ? 'addressproof' : 'aadharcard',
                        index,
                        true,
                        1,
                      )
                    }
                    enableDownloads={this.checkurl(0, durl[index])}
                    downloadUrl={this.checkurl(1, durl[index])}
                  />
                );
              })}
          </>
        ) : null}

        {title === 'Profile' ? (
          <>
            <CommonFileUpload
              truDownloadEnable={truDownloadEnable}
              title={'Cancelled Cheque'}
              type={2}
              pickedTitle={this.findFileName(`cancel_chq`)}
              pickedCallback={(selected, res) => {
                this.state.fileList.push({cancel_chq: res});
              }}
              enableDownloads={this.checkurl(0, cancelChq)}
              downloadUrl={this.checkurl(1, cancelChq)}
              mode={mode}
              downloadTitles={downloadTitles}
              keyName={'cancel_chq'}
            />
            <CommonFileUpload
              truDownloadEnable={truDownloadEnable}
              title={'GST Certificate'}
              type={2}
              pickedTitle={this.findFileName(`gst_cert`)}
              pickedCallback={(selected, res) => {
                this.state.fileList.push({gst_cert: res});
              }}
              enableDownloads={this.checkurl(0, gstImage)}
              downloadUrl={this.checkurl(1, gstImage)}
              mode={mode}
              downloadTitles={downloadTitles}
              keyName={'gst_cert'}
            />
          </>
        ) : null}

        {title === 'Motor Insurance' ? (
          <View>
            <CommonFileUpload
              showPlusIcon={false}
              plusClicked={() => this.insertValueFormultipleFilePick(4)}
              truDownloadEnable={truDownloadEnable}
              title={`RC Book ${truDownloadEnable === 1 ? '1' : ''}`}
              type={2}
              pickedTitle={this.findFileName(`rcbookcopy`)}
              pickedCallback={(selected, res) =>
                this.fileselected(res, 'rcbookcopy', -1, false, -1)
              }
              enableDownloads={this.checkurl(0, rcCopy)}
              downloadUrl={this.checkurl(1, rcCopy)}
              mode={mode}
              downloadTitles={downloadTitles}
              keyName={'rcbookcopy'}
            />

            {this.state.multipleFilesList &&
              this.state.multipleFilesList[4].filled.map((e, index) => {
                const durl = this.state.multipleFilesList[4].downloadUrl;
                const namesList = this.state.multipleFilesList[4].names;
                return (
                  <CommonFileUpload
                    minusClicked={() =>
                      this.removeValueFormultipleFilePick(4, index)
                    }
                    showMinusIcon={true}
                    //editMode={editMode}
                    // downloadTitles={
                    //   truDownloadEnable === -1 ? '' : `RC Book ${index + 2}`
                    // }
                    truDownloadEnable={truDownloadEnable}
                    mode={mode}
                    title={`RC Book ${index + 2}`}
                    type={2}
                    pickedTitle={namesList[index]}
                    pickedCallback={(selected, res) =>
                      this.fileselected(res, 'rcbookcopy', index, true, 4)
                    }
                    enableDownloads={this.checkurl(0, durl[index])}
                    downloadUrl={this.checkurl(1, durl[index])}
                    keyName={`rcbookcopy${index + 1}`}
                  />
                );
              })}

            <CommonFileUpload
              showPlusIcon={false}
              plusClicked={() => this.insertValueFormultipleFilePick(5)}
              title={`Policy ${truDownloadEnable === 1 ? '1' : ''}`}
              type={2}
              pickedTitle={this.findFileName(`policycopy`)}
              pickedCallback={(selected, res) =>
                this.fileselected(res, 'policycopy', -1, false, -1)
              }
              enableDownloads={this.checkurl(0, policycopy)}
              downloadUrl={this.checkurl(1, policycopy)}
              mode={mode}
              downloadTitles={downloadTitles}
              truDownloadEnable={truDownloadEnable}
              keyName={`policycopy`}
            />
            {this.state.multipleFilesList &&
              this.state.multipleFilesList[5].filled.map((e, index) => {
                const durl = this.state.multipleFilesList[5].downloadUrl;
                const namesList = this.state.multipleFilesList[5].names;
                return (
                  <CommonFileUpload
                    minusClicked={() =>
                      this.removeValueFormultipleFilePick(5, index)
                    }
                    showMinusIcon={true}
                    // editMode={editMode}
                    // downloadTitles={
                    //   truDownloadEnable === -1 ? '' : `Policy ${index + 2}`
                    // }
                    // truDownloadEnable={truDownloadEnable}
                    truDownloadEnable={truDownloadEnable}
                    mode={mode}
                    title={`Policy ${index + 2}`}
                    type={2}
                    pickedTitle={namesList[index]}
                    pickedCallback={(selected, res) =>
                      this.fileselected(res, 'policycopy', index, true)
                    }
                    enableDownloads={this.checkurl(0, durl[index])}
                    downloadUrl={this.checkurl(1, durl[index])}
                    keyName={`policycopy${index + 1}`}
                  />
                );
              })}

            <CommonFileUpload
              showPlusIcon={false}
              plusClicked={() => this.insertValueFormultipleFilePick(6)}
              title={`Old Insurance Policy ${
                truDownloadEnable === 1 ? '1' : ''
              }`}
              type={2}
              pickedTitle={this.findFileName(`oldinsurancecopy`)}
              pickedCallback={(selected, res) =>
                this.fileselected(res, 'oldinsurancecopy', -1, false, -1)
              }
              enableDownloads={this.checkurl(0, oldInsCopy)}
              downloadUrl={this.checkurl(1, oldInsCopy)}
              mode={mode}
              downloadTitles={downloadTitles}
              truDownloadEnable={truDownloadEnable}
              keyName={`oldinsurancecopy`}
            />

            {this.state.multipleFilesList &&
              this.state.multipleFilesList[6].filled.map((e, index) => {
                const durl = this.state.multipleFilesList[6].downloadUrl;
                const namesList = this.state.multipleFilesList[6].names;
                return (
                  <CommonFileUpload
                    minusClicked={() =>
                      this.removeValueFormultipleFilePick(6, index)
                    }
                    showMinusIcon={true}
                    //editMode={editMode}
                    downloadTitles={downloadTitles}
                    truDownloadEnable={truDownloadEnable}
                    mode={mode}
                    title={`Old Insurance Policy ${index + 2}`}
                    type={2}
                    keyName={`oldinsurancecopy${index + 1}`}
                    pickedTitle={namesList[index]}
                    pickedCallback={(selected, res) =>
                      this.fileselected(res, 'oldinsurancecopy', index, true, 6)
                    }
                    enableDownloads={this.checkurl(0, durl[index])}
                    downloadUrl={this.checkurl(1, durl[index])}
                  />
                );
              })}

            <CommonFileUpload
              showPlusIcon={false}
              plusClicked={() => this.insertValueFormultipleFilePick(7)}
              title={`PUC ${truDownloadEnable === 1 ? '1' : ''}`}
              type={2}
              pickedTitle={this.findFileName(`puccopy`)}
              pickedCallback={(selected, res) =>
                this.fileselected(res, 'puccopy', -1, false, -1)
              }
              enableDownloads={this.checkurl(0, puccopy)}
              downloadUrl={this.checkurl(1, puccopy)}
              mode={mode}
              downloadTitles={downloadTitles}
              truDownloadEnable={truDownloadEnable}
              keyName={`puccopy`}
            />

            {this.state.multipleFilesList &&
              this.state.multipleFilesList[7].filled.map((e, index) => {
                const durl = this.state.multipleFilesList[7].downloadUrl;
                const namesList = this.state.multipleFilesList[7].names;
                return (
                  <CommonFileUpload
                    minusClicked={() =>
                      this.removeValueFormultipleFilePick(7, index)
                    }
                    showMinusIcon={true}
                    //editMode={editMode}
                    downloadTitles={downloadTitles}
                    truDownloadEnable={truDownloadEnable}
                    mode={mode}
                    title={`PUC ${index + 2}`}
                    type={2}
                    keyName={`puccopy${index + 1}`}
                    pickedTitle={namesList[index]}
                    pickedCallback={(selected, res) =>
                      this.fileselected(res, 'puccopy', index, true, 7)
                    }
                    enableDownloads={this.checkurl(0, durl[index])}
                    downloadUrl={this.checkurl(1, durl[index])}
                  />
                );
              })}
          </View>
        ) : null}

        {title === 'Demat' ? (
          <CommonFileUpload
            title={'Cancelled Cheque'}
            type={0}
            pickedTitle={this.findFileName(`cancelcheque`)}
            pickedCallback={(selected, res) => {
              if (!selected) {
                this.state.fileList.push({cancelcheque: res});
              }
            }}
            mode={mode}
            downloadTitles={downloadTitles}
            truDownloadEnable={truDownloadEnable}
            keyName={`cancelcheque`}
          />
        ) : null}

        {loanCheck ? (
          <View>
            {title !== 'Gold Loan' && title !== 'Health Insurance' ? (
              <>
                <CommonFileUpload
                  showPlusIcon={true}
                  truDownloadEnable={truDownloadEnable}
                  title={
                    truDownloadEnable === 1
                      ? `Salary Slip 1`
                      : this.mandatoryName(
                          `${
                            title.includes('Loan')
                              ? `3 Months Salary Slip/3 Year ITR`
                              : title === 'Credit Card'
                              ? `Salary Slip`
                              : `6 Months Salary Slip`
                          }`,
                          title,
                        )
                  }
                  type={2}
                  pickedTitle={this.findFileName('salaryslip')}
                  pickedCallback={(selected, res) =>
                    this.fileselected(res, 'salaryslip', -1, false, -1)
                  }
                  enableDownloads={this.checkurl(0, salarySlip)}
                  downloadUrl={this.checkurl(1, salarySlip)}
                  mode={mode}
                  downloadTitles={downloadTitles}
                  plusClicked={() => this.insertValueFormultipleFilePick(2)}
                  keyName={`salaryslip`}
                />

                {this.state.multipleFilesList &&
                  this.state.multipleFilesList[2].filled.map((e, index) => {
                    const durl = this.state.multipleFilesList[2].downloadUrl;
                    const namesList = this.state.multipleFilesList[2].names;
                    return (
                      <CommonFileUpload
                        minusClicked={() =>
                          this.removeValueFormultipleFilePick(2, index)
                        }
                        showMinusIcon={true}
                        //editMode={editMode}
                        downloadTitles={downloadTitles}
                        truDownloadEnable={truDownloadEnable}
                        mode={mode}
                        title={`Salary Slip ${index + 2}`}
                        type={2}
                        pickedTitle={namesList[index]}
                        pickedCallback={(selected, res) =>
                          this.fileselected(res, 'salaryslip', index, true, 2)
                        }
                        enableDownloads={this.checkurl(0, durl[index])}
                        downloadUrl={this.checkurl(1, durl[index])}
                        keyName={`salaryslip${index + 1}`}
                      />
                    );
                  })}

                <CommonFileUpload
                  showPlusIcon={true}
                  plusClicked={() => this.insertValueFormultipleFilePick(3)}
                  title={
                    truDownloadEnable === 1
                      ? `Bank Statement 1`
                      : this.mandatoryName(
                          `${
                            title === 'Credit Card'
                              ? '1 Year Bank Statement'
                              : `6 Month Bank Statement`
                          }`,
                          title,
                        )
                  }
                  type={2}
                  //fileType={1}
                  pickedTitle={this.findFileName(`bankstate`)}
                  pickedCallback={(selected, res) =>
                    this.fileselected(res, 'bankstate', -1, false, -1)
                  }
                  enableDownloads={this.checkurl(0, bankState)}
                  downloadUrl={this.checkurl(1, bankState)}
                  mode={mode}
                  downloadTitles={downloadTitles}
                  truDownloadEnable={truDownloadEnable}
                  keyName={`bankstate`}
                />

                {this.state.multipleFilesList &&
                  this.state.multipleFilesList[3].filled.map((e, index) => {
                    const durl = this.state.multipleFilesList[3].downloadUrl;
                    const namesList = this.state.multipleFilesList[3].names;
                    return (
                      <CommonFileUpload
                        minusClicked={() =>
                          this.removeValueFormultipleFilePick(3, index)
                        }
                        showMinusIcon={true}
                        //editMode={editMode}
                        downloadTitles={downloadTitles}
                        truDownloadEnable={truDownloadEnable}
                        mode={mode}
                        title={`Bank Statement ${index + 2}`}
                        type={2}
                        //fileType={1}
                        pickedTitle={namesList[index]}
                        pickedCallback={(selected, res) =>
                          this.fileselected(res, 'bankstate', index, true, 3)
                        }
                        enableDownloads={this.checkurl(0, durl[index])}
                        downloadUrl={this.checkurl(1, durl[index])}
                        keyName={`bankstate${index + 1}`}
                      />
                    );
                  })}
              </>
            ) : null}

            <CommonFileUpload
              showPlusIcon={true}
              plusClicked={() => this.insertValueFormultipleFilePick(9)}
              title={
                truDownloadEnable === 1
                  ? `Other 1`
                  : this.mandatoryName(`Other`, title)
              }
              type={2}
              pickedTitle={this.findFileName(`other`)}
              pickedCallback={(selected, res) =>
                this.fileselected(res, 'other', -1, false, -1)
              }
              enableDownloads={this.checkurl(0, other)}
              downloadUrl={this.checkurl(1, other)}
              mode={mode}
              downloadTitles={downloadTitles}
              truDownloadEnable={truDownloadEnable}
              keyName={`other`}
            />

            {this.state.multipleFilesList &&
              this.state.multipleFilesList[9].filled.map((e, index) => {
                const durl = this.state.multipleFilesList[9].downloadUrl;
                const namesList = this.state.multipleFilesList[9].names;
                return (
                  <CommonFileUpload
                    minusClicked={() =>
                      this.removeValueFormultipleFilePick(9, index)
                    }
                    showMinusIcon={true}
                    //editMode={editMode}
                    downloadTitles={downloadTitles}
                    truDownloadEnable={truDownloadEnable}
                    mode={mode}
                    title={`Other ${index + 2}`}
                    type={2}
                    pickedTitle={namesList[index]}
                    pickedCallback={(selected, res) =>
                      this.fileselected(res, 'other', index, true, 9)
                    }
                    enableDownloads={this.checkurl(0, durl[index])}
                    downloadUrl={this.checkurl(1, durl[index])}
                    keyName={`other${index + 1}`}
                  />
                );
              })}

            {title === 'Health Insurance' ||
            (title === 'Credit Card' &&
              this.state.existingcard.includes('Yes')) ? (
              <>
                <CommonFileUpload
                  showPlusIcon={true}
                  plusClicked={() => this.insertValueFormultipleFilePick(8)}
                  title={
                    truDownloadEnable === 1
                      ? `Existing 1`
                      : this.mandatoryName(
                          title === 'Credit Card'
                            ? `Existing Card Documents`
                            : `Existing`,
                          title,
                        )
                  }
                  type={2}
                  pickedTitle={this.findFileName(`existing`)}
                  pickedCallback={(selected, res) =>
                    this.fileselected(res, 'existing', -1, false, -1)
                  }
                  enableDownloads={this.checkurl(0, existing)}
                  downloadUrl={this.checkurl(1, existing)}
                  mode={mode}
                  downloadTitles={downloadTitles}
                  truDownloadEnable={truDownloadEnable}
                  keyName={`existing`}
                />
                {this.state.multipleFilesList &&
                  this.state.multipleFilesList[8].filled.map((e, index) => {
                    const durl = this.state.multipleFilesList[8].downloadUrl;
                    const namesList = this.state.multipleFilesList[8].names;
                    return (
                      <CommonFileUpload
                        minusClicked={() =>
                          this.removeValueFormultipleFilePick(8, index)
                        }
                        showMinusIcon={true}
                        //editMode={editMode}
                        downloadTitles={downloadTitles}
                        truDownloadEnable={truDownloadEnable}
                        mode={mode}
                        title={`Existing ${index + 2}`}
                        type={2}
                        pickedTitle={namesList[index]}
                        pickedCallback={(selected, res) =>
                          this.fileselected(res, 'existing', index, true, 8)
                        }
                        enableDownloads={this.checkurl(0, durl[index])}
                        downloadUrl={this.checkurl(1, durl[index])}
                        keyName={`existing${index + 1}`}
                      />
                    );
                  })}
              </>
            ) : null}

            {title === 'Credit Card' &&
            employ !== '' &&
            employ === 'Self Employed' ? (
              <>
                <CommonFileUpload
                  showPlusIcon={true}
                  plusClicked={() => this.insertValueFormultipleFilePick(10)}
                  title={
                    truDownloadEnable === 1
                      ? `ITR 1`
                      : this.mandatoryName(`ITR`, title)
                  }
                  type={2}
                  pickedTitle={this.findFileName(`itrdoc`)}
                  pickedCallback={(selected, res) =>
                    this.fileselected(res, 'itrdoc', -1, false, -1)
                  }
                  enableDownloads={this.checkurl(0, itrdoc)}
                  downloadUrl={this.checkurl(1, itrdoc)}
                  mode={mode}
                  downloadTitles={downloadTitles}
                  truDownloadEnable={truDownloadEnable}
                  keyName={`itrdoc`}
                />
                {this.state.multipleFilesList &&
                  this.state.multipleFilesList[10].filled.map((e, index) => {
                    const durl = this.state.multipleFilesList[10].downloadUrl;
                    const namesList = this.state.multipleFilesList[10].names;
                    return (
                      <CommonFileUpload
                        minusClicked={() =>
                          this.removeValueFormultipleFilePick(10, index)
                        }
                        showMinusIcon={true}
                        //editMode={editMode}
                        downloadTitles={downloadTitles}
                        truDownloadEnable={truDownloadEnable}
                        mode={mode}
                        title={`ITR ${index + 2}`}
                        type={2}
                        pickedTitle={namesList[index]}
                        pickedCallback={(selected, res) =>
                          this.fileselected(res, 'itrdoc', index, true, 10)
                        }
                        enableDownloads={this.checkurl(0, durl[index])}
                        downloadUrl={this.checkurl(1, durl[index])}
                        keyName={`itrdoc${index + 1}`}
                      />
                    );
                  })}
              </>
            ) : null}
          </View>
        ) : null}

        {loanCheck === false &&
        title !== 'Profile' &&
        title !== 'Motor Insurance' &&
        title !== 'Term Insurance' &&
        title !== 'Fixed Deposit' &&
        !title.includes('Life') &&
        !title.includes('Mutual') && title !== 'TMP' ? (
          <View>
            {truDownloadEnable === 1 ? (
              <View
                styleName="vertical"
                style={{marginStart: sizeWidth(2), marginVertical: 0}}>
                {/* <Subtitle style={styles.title1}>
                  {this.showhideheading()}
                </Subtitle> */}
              </View>
            ) : (
              <View
                styleName="vertical"
                style={{marginStart: sizeWidth(2), marginVertical: 12}}>
                <Subtitle style={styles.title1}>
                  {title === 'Personal Loan'
                    ? `3 Months Salary Slip`
                    : title === 'Credit Card'
                    ? `3 Months Salary Slip or 1 Years ITR`
                    : (title === 'Home Loan' ||
                        title === 'Loan Against Property') &&
                      headerchange === true
                    ? `6 Months Salary Slip`
                    : (title === 'Home Loan' ||
                        title === 'Loan Against Property') &&
                      headerchange === false
                    ? `3 Years ITR`
                    : title === 'Loan Against Property'
                    ? `6 Months Salary Slip or 3 Years ITR`
                    : `3 Years ITR`}
                </Subtitle>
              </View>
            )}
            <CommonFileUpload
              title={this.mandatoryName(
                `${
                  (title === 'Home Loan' ||
                    title === 'Loan Against Property' ||
                    'Auto Loan' ||
                    title === 'Business Loan') &&
                  headerchange === false
                    ? ``
                    : `Salary Slip 1`
                }`,
                title,
              )}
              // title={`${(title === 'Home Loan' || title === 'Loan Against Property') && headerchange === false ? `` : `Salary Slip 1`}${title === 'Auto Loan' || title === 'Business Loan' || title === 'Personal Loan' ? ` *` : ``}`}
              type={2}
              pickedTitle={this.findFileName(`salaryslip`)}
              pickedCallback={(selected, res) => {
                this.state.fileList.push({salaryslip: res});
              }}
              enableDownloads={
                salarySlip != null && this.checkurl(0, salarySlip)
              }
              downloadUrl={this.checkurl(1, salarySlip)}
              mode={mode}
              downloadTitles={
                downloadTitles === '' ? downloadTitles : 'Salary Slip 1'
              }
              truDownloadEnable={truDownloadEnable}
            />

            <CommonFileUpload
              title={this.mandatoryName(
                `${
                  (title === 'Home Loan' ||
                    title === 'Loan Against Property' ||
                    'Auto Loan' ||
                    title === 'Business Loan') &&
                  headerchange === false
                    ? ``
                    : `Salary Slip 2`
                }`,
                title,
              )}
              // title={`${(title === 'Home Loan' || title === 'Loan Against Property') && headerchange === false ? `` : `Salary Slip 2`}${title === 'Auto Loan' || title === 'Business Loan' || title === 'Personal Loan' ? ` *` : ``}`}
              type={2}
              pickedTitle={this.findFileName(`salaryslip1`)}
              pickedCallback={(selected, res) => {
                this.state.fileList.push({salaryslip1: res});
              }}
              enableDownloads={
                salarySlip1 != null && this.checkurl(0, salarySlip1)
              }
              downloadUrl={this.checkurl(1, salarySlip1)}
              mode={mode}
              downloadTitles={
                downloadTitles === '' ? downloadTitles : 'Salary Slip 2'
              }
              truDownloadEnable={truDownloadEnable}
            />

            <CommonFileUpload
              // title={`${(title === 'Home Loan' || title === 'Loan Against Property') && headerchange === false ? `` : `Salary Slip 3`}${title === 'Auto Loan' || title === 'Business Loan' || title === 'Personal Loan' ? ` *` : ``}`}
              title={this.mandatoryName(
                `${
                  (title === 'Home Loan' ||
                    title === 'Loan Against Property' ||
                    'Auto Loan' ||
                    title === 'Business Loan') &&
                  headerchange === false
                    ? ``
                    : `Salary Slip 3`
                }`,
                title,
              )}
              type={2}
              pickedTitle={this.findFileName(`salaryslip2`)}
              pickedCallback={(selected, res) => {
                this.state.fileList.push({salaryslip2: res});
              }}
              enableDownloads={
                salarySlip2 != null && this.checkurl(0, salarySlip2)
              }
              downloadUrl={this.checkurl(1, salarySlip2)}
              mode={mode}
              downloadTitles={
                downloadTitles === '' ? downloadTitles : 'Salary Slip 3'
              }
              truDownloadEnable={truDownloadEnable}
            />

            {(title === 'Loan Against Property' || title === 'Home Loan') &&
            headerchange === true ? (
              <View>
                <CommonFileUpload
                  title={'Salary Slip 4'}
                  type={2}
                  pickedTitle={this.findFileName(`salaryslip3`)}
                  pickedCallback={(selected, res) => {
                    this.state.fileList.push({salaryslip3: res});
                  }}
                  enableDownloads={
                    salarySlip3 != null && this.checkurl(0, salarySlip3)
                  }
                  downloadUrl={this.checkurl(1, salarySlip3)}
                  mode={mode}
                  downloadTitles={
                    downloadTitles === '' ? downloadTitles : 'Salary Slip 4'
                  }
                  truDownloadEnable={truDownloadEnable}
                />
                <CommonFileUpload
                  title={'Salary Slip 5'}
                  type={2}
                  pickedTitle={this.findFileName(`salaryslip4`)}
                  pickedCallback={(selected, res) => {
                    this.state.fileList.push({salaryslip4: res});
                  }}
                  enableDownloads={
                    salarySlip4 != null && this.checkurl(0, salarySlip4)
                  }
                  downloadUrl={this.checkurl(1, salarySlip4)}
                  mode={mode}
                  downloadTitles={
                    downloadTitles === '' ? downloadTitles : 'Salary Slip 5'
                  }
                  truDownloadEnable={truDownloadEnable}
                />
                <CommonFileUpload
                  title={'Salary Slip 6'}
                  type={2}
                  pickedTitle={this.findFileName(`salaryslip5`)}
                  pickedCallback={(selected, res) => {
                    this.state.fileList.push({salaryslip5: res});
                  }}
                  enableDownloads={
                    salarySlip5 != null && this.checkurl(0, salarySlip5)
                  }
                  downloadUrl={this.checkurl(1, salarySlip5)}
                  mode={mode}
                  downloadTitles={
                    downloadTitles === '' ? downloadTitles : 'Salary Slip 6'
                  }
                  truDownloadEnable={truDownloadEnable}
                />
              </View>
            ) : null}

            <CommonFileUpload
              title={this.mandatoryName(
                `${
                  title === 'Home Loan' || title === 'Credit Card'
                    ? '1 Year Bank Statement'
                    : `3 Month Bank Statement`
                }`,
                title,
              )}
              // title={
              //   title === 'Home Loan'
              //     ? '1 Year Bank Statement'
              //     : `3 Month Bank Statement ${title === 'Auto Loan' || title === 'Business Loan' || title === 'Personal Loan' ? ` *` : ``}`
              // }
              type={1}
              fileType={1}
              pickedTitle={this.findFileName(`bankstate`)}
              pickedCallback={(selected, res) => {
                this.state.fileList.push({bankstate: res});
              }}
              enableDownloads={bankState != null && this.checkurl(0, bankState)}
              downloadUrl={this.checkurl(1, bankState)}
              mode={mode}
              downloadTitles={downloadTitles}
              truDownloadEnable={truDownloadEnable}
            />
          </View>
        ) : null}

        {title === 'TMP' ? (
          <FilePicker
            truDownloadEnable={truDownloadEnable}
            title={'Policy'}
            type={2}
            totalFile={6}
            downloadList={[tmpPolicy]}
            restoreFileList={this.state.restoreFileList['tmp_file_upload']}
            pickedCallback={(pickedFiles) => {
              if(pickedFiles.length > 0){
                pickedFiles.map((obj,index) =>{
                  const filePickedObj = {};
                  const keyName = index === 0 ? `tmp_file_upload` : `tmp_file_upload${index+1}`;
                  filePickedObj[keyName] = obj;
                  const findIndex = Lodash.findLastIndex(this.state.fileList, io =>{
                    const finditem = io[keyName];
                    return finditem;
                  });
                  if(findIndex >= 0){
                    this.state.fileList[findIndex] = filePickedObj;
                  }else{
                    this.state.fileList.push(filePickedObj);
                  }
                });
                const store = this.state.restoreFileList;
                store['tmp_file_upload'] = pickedFiles;
                this.setState({restoreFileList:store});
              }
            }}
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
  popcont: {flex: 1, flexDirection: 'row'},
  newdropdowntextstyle: {
    color: '#6d6a57',
    fontSize: 14,
    fontFamily: Pref.getFontName(4),
  },
  newdropdowncontainers: {
    borderRadius: 0,
    borderBottomColor: '#f2f1e6',
    borderBottomWidth: 1.3,
    borderWidth: 0,
    marginStart: 10,
    marginEnd: 10,
    paddingVertical: 10,
  },
  dropdowntextstyle: {
    color: '#6d6a57',
    fontSize: 14,
    fontFamily: Pref.getFontName(4),
  },
  dropdownmulticontainer: {
    borderRadius: 0,
    borderBottomColor: '#f2f1e6',
    borderBottomWidth: 1.3,
    borderWidth: 0,
    marginStart: 10,
    marginEnd: 10,
    paddingVertical: 10,
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
    color: '#292929',
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
    fontSize: 15,
    fontWeight: '700',
    color: '#6d6a57',
    lineHeight: 20,
    marginStart: 4,
    marginVertical: 8,
  },
  title2: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6d6a57',
    lineHeight: 20,
    marginStart: 8,
    marginVertical: 10,
  },
});
