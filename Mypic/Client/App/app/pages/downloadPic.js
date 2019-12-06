import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar,
    SafeAreaView,
    Dimensions,
    ImageBackground,
    TouchableWithoutFeedback,
    Platform,
    Slider,
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import DownloadPicHeader from "../components/DownloadPicHeader"
import * as Font from "expo-font";
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import ndarray from 'ndarray'
import gemm from 'ndarray-gemm'
import ops from 'ndarray-ops'
import pack from 'ndarray-pack'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'


var { height, width } = Dimensions.get('window');

export default class DownloadPic extends Component {
    constructor(props){
        super(props);
        /*
        props : {
            uid : user id
            profile_embeddings: user's profile embeddings
            tour_info : tour information
            mypic_ref: reference to 'User/Mytour/<Tourname>'
            tour_refs : reference to 'Tour/<Tourname>'
        }
        */

        this.state={
            tour: this.props.tour_info, // copy from props for easy use
            images : [],                // All images from myImages
            likelihoods : [],           // All likelihoods from myImages
            my_images : [],             // images above threshold
            uris : [],                  // uri for download images (Unused)
            fontLoaded: false,
            threshold: 0.45,
            file_names: [],
            profile_embeddings: this.props.profile_embeddings,
            profile_embeddings_ndarray: null,
            tour_images_embeddings: [],
            tour_images_embeddings_ndarray: [],
        };
    }

    componentDidMount = async () => {
        
        await this.props.tour_ref
            .collection("Embedding")
            .get().then( (querySnapshot) => {
//            .onSnapshot( (querySnapshot) => {
                querySnapshot.forEach( (doc) => {
                    let doc_data = doc.data();
                    let doc_id = doc.id;
                    let image_embeddings = new Array(); 
//                    let image_map = new Map();      // map image name and embedding
                    for (var key in doc_data){
                        value = doc_data[key]
                        image_embeddings.push(value)
                    }
//                    image_map.set("embeddings", image_embeddings);
//                    image_map.set("file_name", doc_id);

                    let append_file_name = this.state.file_names.concat(doc_id);
                    let append_tour_images_embeddings= this.state.tour_images_embeddings.concat(image_embeddings);
                    let append_tour_images_embeddings_ndarray = this.state.tour_images_embeddings_ndarray.concat(pack(image_embeddings))
                    this.setState({
                        file_names : append_file_name,
                        tour_images_embeddings : append_tour_images_embeddings,
                        tour_images_embeddings_ndarray: append_tour_images_embeddings_ndarray,
                    })
                })

            }).catch(error => console.log(error));

            
        await Font.loadAsync({
            'Gaegu-Regular': require('../../assets/fonts/Gaegu/Gaegu-Regular.ttf'),
            'EastSeaDokdo-Regular': require('../../assets/fonts/East_Sea_Dokdo/EastSeaDokdo-Regular.ttf'),
            'Nanum_pen_Script-Regular': require('../../assets/fonts/Nanum_Pen_Script/NanumPenScript-Regular.ttf'),
            'Yeon_Sung-Regular': require('../../assets/fonts/Yeon_Sung/YeonSung-Regular.ttf'),
        });
        this.setState({ fontLoaded: true });

        this.setState({
            profile_embeddings : [[ 2.22116724e-01, -4.02361810e-01, -4.04482365e-01, -9.09869909e-01,
       -7.29972661e-01, -5.11334896e-01,  1.02225590e+00,  8.54286179e-02,
        3.91787857e-01,  1.84586033e-01, -1.14721012e+00, -8.68305504e-01,
       -7.40212202e-02,  1.19765091e+00, -5.88397503e-01, -1.07474208e+00,
        3.10262859e-01, -3.02804351e+00,  6.09915257e-01, -6.36556208e-01,
       -9.23568308e-01, -1.77694881e+00,  4.38466847e-01,  1.76126137e-01,
       -1.10988772e+00, -1.54649556e+00, -1.16633677e+00,  4.91892189e-01,
       -9.54705417e-01,  2.87105739e-01, -1.70264018e+00,  9.62250054e-01,
       -2.85705256e+00,  6.53184891e-01, -7.91114420e-02, -1.96289206e+00,
       -8.02103817e-01,  5.84656060e-01,  1.37532596e-02, -1.23447888e-01,
       -2.14240074e-01, -1.36516774e+00,  9.91488338e-01, -6.91956222e-01,
       -1.26339063e-01, -9.02949452e-01, -1.49104536e+00,  6.88490093e-01,
        9.02603865e-01, -4.96884495e-01,  1.73208225e+00, -3.18868041e-01,
       -6.14522934e-01,  2.19898432e-01,  1.58850539e+00,  1.01294422e+00,
       -1.90799773e-01, -1.57659963e-01, -1.06882751e+00, -1.10534632e+00,
       -1.40870380e+00, -7.90239692e-01, -4.19907779e-01,  1.95472479e+00,
        9.88049686e-01,  7.45732248e-01, -1.53979754e+00, -1.44858980e+00,
        1.02557790e+00,  7.91234016e-01, -8.42248142e-01,  1.05262232e+00,
        6.50503933e-01, -2.27725148e-01, -9.37588513e-01, -3.98027807e-01,
       -1.27668417e+00,  6.48414969e-01, -9.46183205e-01, -1.71863294e+00,
        3.49365652e-01,  7.11228669e-01,  1.52907956e+00, -2.11683348e-01,
        7.53869563e-02,  2.23087764e+00,  1.30877316e+00, -8.40321183e-01,
        1.56602606e-01, -9.94446158e-01, -1.12973952e+00,  1.64619768e+00,
        1.57794058e-01,  4.62480187e-01, -7.31982529e-01,  2.92498559e-01,
        2.11364612e-01,  3.23106259e-01,  3.31706218e-02,  6.29408121e-01,
        1.69379845e-01,  1.10369511e-01, -2.02984780e-01, -9.39656198e-02,
        2.99598551e+00,  5.78996718e-01, -1.29932249e+00,  5.78375995e-01,
       -6.24257207e-01,  5.02711117e-01,  7.37189472e-01,  1.47245407e+00,
       -1.12861168e+00, -1.17990211e-01, -6.75615311e-01,  2.42558646e+00,
       -2.14931443e-01, -6.53340757e-01,  2.44674310e-01, -1.14761186e+00,
        7.42510915e-01,  1.10757375e+00, -7.44320750e-01,  2.80331284e-01,
        4.70189899e-01,  1.36380041e+00, -5.24020612e-01, -1.78434789e+00,
       -1.30208999e-01, -2.41067201e-01,  4.64723557e-01, -7.50797868e-01,
       -3.45937163e-01,  1.41652775e+00,  9.11439657e-01, -8.91878605e-01,
       -9.73972380e-01, -4.12582755e-01, -1.75707310e-01,  1.02399337e+00,
        7.75139779e-02, -6.14000320e-01,  1.25911164e+00, -7.92804122e-01,
        1.50595033e+00, -1.39665198e+00, -1.16517198e+00, -1.67151284e+00,
       -2.59376675e-01,  6.97967172e-01,  5.30040860e-01,  2.28924346e+00,
        7.66064823e-01, -2.17386508e+00,  1.59882843e+00, -5.54172635e-01,
        1.21963620e+00, -3.93714197e-02, -1.31091714e+00,  7.42854357e-01,
        2.00439095e+00, -5.13059139e-01, -2.44468641e+00,  1.35665107e+00,
       -1.49333668e+00, -1.15263216e-01,  1.36121795e-01, -1.38238728e+00,
       -1.95451260e-01,  5.13677657e-01, -1.24885631e+00, -2.33965904e-01,
        1.34449470e+00, -1.09071195e+00,  2.50367433e-01, -1.15280652e+00,
        9.01499689e-01,  1.03993249e+00, -4.12209660e-01,  2.22587347e-01,
        1.34633052e+00, -4.27733719e-01, -6.90924704e-01,  2.80860096e-01,
        1.94244218e+00,  1.62677777e+00,  2.96576351e-01, -1.14794165e-01,
       -7.66146719e-01,  9.97646689e-01, -1.50430471e-01, -3.08465511e-01,
        2.15108418e+00,  1.56522143e+00, -5.25081158e-02, -2.54243493e+00,
       -3.16063408e-03,  1.33396161e+00, -9.58817452e-02, -1.38763562e-01,
       -1.27504230e+00, -5.20467937e-01,  1.56177187e+00,  1.65964496e+00,
        1.40392625e+00,  1.59660459e+00, -2.38208234e-01,  5.32209054e-02,
       -2.93186884e-02, -3.32193941e-01,  2.24104330e-01, -3.43355983e-01,
        1.22308111e+00,  2.03579456e-01,  1.31335664e+00,  5.59180021e-01,
        8.32077622e-01,  9.50353146e-01,  5.54526806e-01,  2.64152318e-01,
       -1.52422440e+00,  1.91365528e+00,  1.10201323e+00, -3.79075646e-01,
        2.71708035e+00,  4.95928489e-02, -1.13037896e+00,  2.02473283e-01,
       -7.67327428e-01,  1.01336380e-02, -1.45991182e+00, -1.45395130e-01,
        1.44316041e+00, -1.02774888e-01,  1.03022146e+00,  1.01771438e+00,
       -6.58237875e-01,  5.99431276e-01, -6.49065912e-01,  1.88728809e+00,
        7.20667779e-01,  1.55653544e-02, -6.33926928e-01,  4.96037215e-01,
       -2.07937267e-02,  1.32221138e+00, -3.55120480e-01, -6.31799579e-01,
        1.54119074e-01,  5.29551208e-01,  8.30166340e-01,  6.34513021e-01,
        1.21452677e+00,  6.50738001e-01,  7.58212209e-02, -4.57504988e-01,
       -5.75549364e-01,  4.30315375e-01,  4.50323373e-01, -6.79202750e-02,
       -1.42704141e+00,  4.47074145e-01, -1.42420888e+00,  4.96523559e-01,
       -4.35621105e-02,  2.51308465e+00,  1.42979121e+00,  1.71847057e+00,
        3.05921912e-01,  5.62120676e-01, -1.42776716e+00, -7.58627236e-01,
       -1.44234145e+00, -6.39408648e-01,  9.71539378e-01, -3.45011920e-01,
       -6.44568861e-01, -2.34286189e+00,  2.93429524e-01, -7.50852469e-03,
       -2.90271938e-01, -2.90345736e-02, -6.55211926e-01,  9.92434621e-01,
       -4.23164189e-01,  1.01233792e+00,  3.26507479e-01,  2.56795615e-01,
       -1.55415642e+00, -9.07798231e-01, -5.78682542e-01,  3.17181230e-01,
       -1.86550379e+00,  1.38674319e+00,  2.16934538e+00, -1.09074342e+00,
        1.87887073e+00, -2.14718148e-01, -2.53091395e-01,  6.40039980e-01,
        4.26064640e-01, -1.84944665e+00, -2.01671883e-01, -1.22972205e-01,
        1.54956400e+00,  1.41950548e-01,  1.21861175e-02, -6.64412200e-01,
        4.99496460e-01,  3.99651021e-01,  9.16542858e-02, -1.36574459e+00,
       -8.86542380e-01,  5.88447563e-02,  2.32730961e+00,  3.34447831e-01,
       -6.57010496e-01,  7.83549786e-01, -2.15107128e-01,  3.47807854e-02,
        1.06078291e+00, -7.30520606e-01,  1.92858648e+00,  1.97231412e+00,
        7.30185390e-01, -1.01413321e+00, -7.05187738e-01, -1.44916236e+00,
       -5.36610246e-01, -1.59647536e+00,  8.19199324e-01, -9.88365352e-01,
       -2.09222436e-01,  7.63002932e-01,  5.91185212e-01,  2.06921071e-01,
        1.83425331e+00,  3.65372688e-01,  1.05305326e+00,  7.63279498e-01,
        4.56187695e-01, -4.85743165e-01,  6.37273908e-01, -1.58487165e+00,
       -1.87177169e+00,  2.98926622e-01,  1.08664194e-02,  1.48118997e+00,
        1.53415287e+00,  1.24113655e+00,  4.36123133e-01,  9.82597828e-01,
       -1.90707815e+00,  2.96846390e-01,  4.76342052e-01, -1.30352631e-01,
        8.72095346e-01,  8.65356386e-01, -3.23965877e-01,  1.11996710e+00,
       -2.31012940e-01, -9.51565395e-04,  1.35171354e-01, -2.87298150e-02,
        2.76987106e-01,  3.81430030e-01,  8.98535550e-01, -1.49558854e+00,
       -1.96648371e+00,  7.68851757e-01, -2.48626471e+00,  8.89083147e-01,
       -9.23733652e-01, -2.22047448e+00,  1.28698921e+00,  1.67500865e+00,
       -8.44377398e-01,  5.67160845e-01, -1.74551225e+00, -1.46505010e+00,
       -2.47939005e-01, -4.22711253e-01,  1.80045113e-01,  1.19411492e+00,
       -7.51257479e-01,  1.22216296e+00,  1.46009982e+00,  2.81351447e-01,
       -1.14916134e+00,  7.67094865e-02,  7.38053858e-01, -1.02859604e+00,
        2.53777480e+00, -7.94661105e-01, -6.88304543e-01, -4.05845009e-02,
        1.16945088e+00,  1.88352978e+00,  1.12923741e+00,  9.02241170e-01,
        3.33895743e-01,  1.38589633e+00, -8.08177471e-01, -2.32054979e-01,
        1.89235771e+00,  2.32010521e-02, -7.01673150e-01,  8.14474076e-02,
        3.21163130e+00, -2.31862044e+00,  6.16439283e-01, -3.15982223e-01,
       -2.29521975e-01, -1.18995297e+00, -4.90764707e-01, -1.62178099e+00,
       -1.37704039e+00,  7.86454976e-01,  4.61552620e-01,  3.58326733e-01,
       -4.49526370e-01, -1.64460585e-01, -9.70571280e-01, -3.68374646e-01,
        6.45426691e-01,  8.37343395e-01,  2.40032506e+00, -1.90962926e-01,
        3.77363324e-01, -9.85314548e-01, -1.13889170e+00, -3.98057103e-01,
       -7.85044432e-01,  1.62969744e+00, -1.04465222e+00, -3.62059742e-01,
        1.69159546e-01, -1.10464561e+00,  2.59989429e+00, -8.11917067e-01,
        1.84162605e+00, -1.01068461e+00, -5.38092144e-02,  2.14138222e+00,
        1.17945492e+00,  1.85971212e+00,  3.05515081e-01, -3.81727189e-01,
        4.02536899e-01, -4.55531120e-01,  1.54320133e+00, -5.65835595e-01,
       -1.49374330e+00,  7.96822846e-01, -9.66872215e-01, -1.34739292e+00,
        2.53511453e+00,  7.77300477e-01,  4.95505542e-01, -1.31153965e+00,
       -3.88544887e-01, -5.28496265e-01,  2.28974605e+00,  1.33216274e+00,
       -1.27131069e+00,  6.30946577e-01, -7.91089356e-01,  5.39065242e-01,
       -9.06245410e-01, -1.13321579e+00,  6.08184218e-01,  1.52493107e+00,
        1.08218014e+00,  3.15913647e-01,  7.16908693e-01,  1.44548988e+00,
       -2.25758687e-01, -4.27665263e-01,  2.76807696e-01,  4.69037205e-01,
        9.96534407e-01,  7.59863481e-02,  5.70616722e-01,  8.60683799e-01,
       -1.38716912e+00, -4.60378975e-01,  1.84163809e-01, -1.18886411e+00,
       -8.22608054e-01,  2.08936620e+00,  2.43700457e+00, -6.47541165e-01,
       -1.21302299e-01, -3.36294389e+00,  6.30564153e-01,  6.70001566e-01,
        1.15509820e+00, -7.34125018e-01,  3.86333257e-01, -7.35499740e-01,
       -8.19209695e-01,  1.01545835e+00,  4.01012897e-01, -3.43701720e-01,
       -4.99951184e-01, -1.01978743e+00, -1.30751014e-01, -1.16642559e+00,
       -1.79975927e-01, -1.15340412e+00, -6.12371504e-01, -7.11321354e-01], 
       [ 2.22116724e-01, -4.02361810e-01, -4.04482365e-01, -9.09869909e-01,
       -7.29972661e-01, -5.11334896e-01,  1.02225590e+00,  8.54286179e-02,
        3.91787857e-01,  1.84586033e-01, -1.14721012e+00, -8.68305504e-01,
       -7.40212202e-02,  1.19765091e+00, -5.88397503e-01, -1.07474208e+00,
        3.10262859e-01, -3.02804351e+00,  6.09915257e-01, -6.36556208e-01,
       -9.23568308e-01, -1.77694881e+00,  4.38466847e-01,  1.76126137e-01,
       -1.10988772e+00, -1.54649556e+00, -1.16633677e+00,  4.91892189e-01,
       -9.54705417e-01,  2.87105739e-01, -1.70264018e+00,  9.62250054e-01,
       -2.85705256e+00,  6.53184891e-01, -7.91114420e-02, -1.96289206e+00,
       -8.02103817e-01,  5.84656060e-01,  1.37532596e-02, -1.23447888e-01,
       -2.14240074e-01, -1.36516774e+00,  9.91488338e-01, -6.91956222e-01,
       -1.26339063e-01, -9.02949452e-01, -1.49104536e+00,  6.88490093e-01,
        9.02603865e-01, -4.96884495e-01,  1.73208225e+00, -3.18868041e-01,
       -6.14522934e-01,  2.19898432e-01,  1.58850539e+00,  1.01294422e+00,
       -1.90799773e-01, -1.57659963e-01, -1.06882751e+00, -1.10534632e+00,
       -1.40870380e+00, -7.90239692e-01, -4.19907779e-01,  1.95472479e+00,
        9.88049686e-01,  7.45732248e-01, -1.53979754e+00, -1.44858980e+00,
        1.02557790e+00,  7.91234016e-01, -8.42248142e-01,  1.05262232e+00,
        6.50503933e-01, -2.27725148e-01, -9.37588513e-01, -3.98027807e-01,
       -1.27668417e+00,  6.48414969e-01, -9.46183205e-01, -1.71863294e+00,
        3.49365652e-01,  7.11228669e-01,  1.52907956e+00, -2.11683348e-01,
        7.53869563e-02,  2.23087764e+00,  1.30877316e+00, -8.40321183e-01,
        1.56602606e-01, -9.94446158e-01, -1.12973952e+00,  1.64619768e+00,
        1.57794058e-01,  4.62480187e-01, -7.31982529e-01,  2.92498559e-01,
        2.11364612e-01,  3.23106259e-01,  3.31706218e-02,  6.29408121e-01,
        1.69379845e-01,  1.10369511e-01, -2.02984780e-01, -9.39656198e-02,
        2.99598551e+00,  5.78996718e-01, -1.29932249e+00,  5.78375995e-01,
       -6.24257207e-01,  5.02711117e-01,  7.37189472e-01,  1.47245407e+00,
       -1.12861168e+00, -1.17990211e-01, -6.75615311e-01,  2.42558646e+00,
       -2.14931443e-01, -6.53340757e-01,  2.44674310e-01, -1.14761186e+00,
        7.42510915e-01,  1.10757375e+00, -7.44320750e-01,  2.80331284e-01,
        4.70189899e-01,  1.36380041e+00, -5.24020612e-01, -1.78434789e+00,
       -1.30208999e-01, -2.41067201e-01,  4.64723557e-01, -7.50797868e-01,
       -3.45937163e-01,  1.41652775e+00,  9.11439657e-01, -8.91878605e-01,
       -9.73972380e-01, -4.12582755e-01, -1.75707310e-01,  1.02399337e+00,
        7.75139779e-02, -6.14000320e-01,  1.25911164e+00, -7.92804122e-01,
        1.50595033e+00, -1.39665198e+00, -1.16517198e+00, -1.67151284e+00,
       -2.59376675e-01,  6.97967172e-01,  5.30040860e-01,  2.28924346e+00,
        7.66064823e-01, -2.17386508e+00,  1.59882843e+00, -5.54172635e-01,
        1.21963620e+00, -3.93714197e-02, -1.31091714e+00,  7.42854357e-01,
        2.00439095e+00, -5.13059139e-01, -2.44468641e+00,  1.35665107e+00,
       -1.49333668e+00, -1.15263216e-01,  1.36121795e-01, -1.38238728e+00,
       -1.95451260e-01,  5.13677657e-01, -1.24885631e+00, -2.33965904e-01,
        1.34449470e+00, -1.09071195e+00,  2.50367433e-01, -1.15280652e+00,
        9.01499689e-01,  1.03993249e+00, -4.12209660e-01,  2.22587347e-01,
        1.34633052e+00, -4.27733719e-01, -6.90924704e-01,  2.80860096e-01,
        1.94244218e+00,  1.62677777e+00,  2.96576351e-01, -1.14794165e-01,
       -7.66146719e-01,  9.97646689e-01, -1.50430471e-01, -3.08465511e-01,
        2.15108418e+00,  1.56522143e+00, -5.25081158e-02, -2.54243493e+00,
       -3.16063408e-03,  1.33396161e+00, -9.58817452e-02, -1.38763562e-01,
       -1.27504230e+00, -5.20467937e-01,  1.56177187e+00,  1.65964496e+00,
        1.40392625e+00,  1.59660459e+00, -2.38208234e-01,  5.32209054e-02,
       -2.93186884e-02, -3.32193941e-01,  2.24104330e-01, -3.43355983e-01,
        1.22308111e+00,  2.03579456e-01,  1.31335664e+00,  5.59180021e-01,
        8.32077622e-01,  9.50353146e-01,  5.54526806e-01,  2.64152318e-01,
       -1.52422440e+00,  1.91365528e+00,  1.10201323e+00, -3.79075646e-01,
        2.71708035e+00,  4.95928489e-02, -1.13037896e+00,  2.02473283e-01,
       -7.67327428e-01,  1.01336380e-02, -1.45991182e+00, -1.45395130e-01,
        1.44316041e+00, -1.02774888e-01,  1.03022146e+00,  1.01771438e+00,
       -6.58237875e-01,  5.99431276e-01, -6.49065912e-01,  1.88728809e+00,
        7.20667779e-01,  1.55653544e-02, -6.33926928e-01,  4.96037215e-01,
       -2.07937267e-02,  1.32221138e+00, -3.55120480e-01, -6.31799579e-01,
        1.54119074e-01,  5.29551208e-01,  8.30166340e-01,  6.34513021e-01,
        1.21452677e+00,  6.50738001e-01,  7.58212209e-02, -4.57504988e-01,
       -5.75549364e-01,  4.30315375e-01,  4.50323373e-01, -6.79202750e-02,
       -1.42704141e+00,  4.47074145e-01, -1.42420888e+00,  4.96523559e-01,
       -4.35621105e-02,  2.51308465e+00,  1.42979121e+00,  1.71847057e+00,
        3.05921912e-01,  5.62120676e-01, -1.42776716e+00, -7.58627236e-01,
       -1.44234145e+00, -6.39408648e-01,  9.71539378e-01, -3.45011920e-01,
       -6.44568861e-01, -2.34286189e+00,  2.93429524e-01, -7.50852469e-03,
       -2.90271938e-01, -2.90345736e-02, -6.55211926e-01,  9.92434621e-01,
       -4.23164189e-01,  1.01233792e+00,  3.26507479e-01,  2.56795615e-01,
       -1.55415642e+00, -9.07798231e-01, -5.78682542e-01,  3.17181230e-01,
       -1.86550379e+00,  1.38674319e+00,  2.16934538e+00, -1.09074342e+00,
        1.87887073e+00, -2.14718148e-01, -2.53091395e-01,  6.40039980e-01,
        4.26064640e-01, -1.84944665e+00, -2.01671883e-01, -1.22972205e-01,
        1.54956400e+00,  1.41950548e-01,  1.21861175e-02, -6.64412200e-01,
        4.99496460e-01,  3.99651021e-01,  9.16542858e-02, -1.36574459e+00,
       -8.86542380e-01,  5.88447563e-02,  2.32730961e+00,  3.34447831e-01,
       -6.57010496e-01,  7.83549786e-01, -2.15107128e-01,  3.47807854e-02,
        1.06078291e+00, -7.30520606e-01,  1.92858648e+00,  1.97231412e+00,
        7.30185390e-01, -1.01413321e+00, -7.05187738e-01, -1.44916236e+00,
       -5.36610246e-01, -1.59647536e+00,  8.19199324e-01, -9.88365352e-01,
       -2.09222436e-01,  7.63002932e-01,  5.91185212e-01,  2.06921071e-01,
        1.83425331e+00,  3.65372688e-01,  1.05305326e+00,  7.63279498e-01,
        4.56187695e-01, -4.85743165e-01,  6.37273908e-01, -1.58487165e+00,
       -1.87177169e+00,  2.98926622e-01,  1.08664194e-02,  1.48118997e+00,
        1.53415287e+00,  1.24113655e+00,  4.36123133e-01,  9.82597828e-01,
       -1.90707815e+00,  2.96846390e-01,  4.76342052e-01, -1.30352631e-01,
        8.72095346e-01,  8.65356386e-01, -3.23965877e-01,  1.11996710e+00,
       -2.31012940e-01, -9.51565395e-04,  1.35171354e-01, -2.87298150e-02,
        2.76987106e-01,  3.81430030e-01,  8.98535550e-01, -1.49558854e+00,
       -1.96648371e+00,  7.68851757e-01, -2.48626471e+00,  8.89083147e-01,
       -9.23733652e-01, -2.22047448e+00,  1.28698921e+00,  1.67500865e+00,
       -8.44377398e-01,  5.67160845e-01, -1.74551225e+00, -1.46505010e+00,
       -2.47939005e-01, -4.22711253e-01,  1.80045113e-01,  1.19411492e+00,
       -7.51257479e-01,  1.22216296e+00,  1.46009982e+00,  2.81351447e-01,
       -1.14916134e+00,  7.67094865e-02,  7.38053858e-01, -1.02859604e+00,
        2.53777480e+00, -7.94661105e-01, -6.88304543e-01, -4.05845009e-02,
        1.16945088e+00,  1.88352978e+00,  1.12923741e+00,  9.02241170e-01,
        3.33895743e-01,  1.38589633e+00, -8.08177471e-01, -2.32054979e-01,
        1.89235771e+00,  2.32010521e-02, -7.01673150e-01,  8.14474076e-02,
        3.21163130e+00, -2.31862044e+00,  6.16439283e-01, -3.15982223e-01,
       -2.29521975e-01, -1.18995297e+00, -4.90764707e-01, -1.62178099e+00,
       -1.37704039e+00,  7.86454976e-01,  4.61552620e-01,  3.58326733e-01,
       -4.49526370e-01, -1.64460585e-01, -9.70571280e-01, -3.68374646e-01,
        6.45426691e-01,  8.37343395e-01,  2.40032506e+00, -1.90962926e-01,
        3.77363324e-01, -9.85314548e-01, -1.13889170e+00, -3.98057103e-01,
       -7.85044432e-01,  1.62969744e+00, -1.04465222e+00, -3.62059742e-01,
        1.69159546e-01, -1.10464561e+00,  2.59989429e+00, -8.11917067e-01,
        1.84162605e+00, -1.01068461e+00, -5.38092144e-02,  2.14138222e+00,
        1.17945492e+00,  1.85971212e+00,  3.05515081e-01, -3.81727189e-01,
        4.02536899e-01, -4.55531120e-01,  1.54320133e+00, -5.65835595e-01,
       -1.49374330e+00,  7.96822846e-01, -9.66872215e-01, -1.34739292e+00,
        2.53511453e+00,  7.77300477e-01,  4.95505542e-01, -1.31153965e+00,
       -3.88544887e-01, -5.28496265e-01,  2.28974605e+00,  1.33216274e+00,
       -1.27131069e+00,  6.30946577e-01, -7.91089356e-01,  5.39065242e-01,
       -9.06245410e-01, -1.13321579e+00,  6.08184218e-01,  1.52493107e+00,
        1.08218014e+00,  3.15913647e-01,  7.16908693e-01,  1.44548988e+00,
       -2.25758687e-01, -4.27665263e-01,  2.76807696e-01,  4.69037205e-01,
        9.96534407e-01,  7.59863481e-02,  5.70616722e-01,  8.60683799e-01,
       -1.38716912e+00, -4.60378975e-01,  1.84163809e-01, -1.18886411e+00,
       -8.22608054e-01,  2.08936620e+00,  2.43700457e+00, -6.47541165e-01,
       -1.21302299e-01, -3.36294389e+00,  6.30564153e-01,  6.70001566e-01,
        1.15509820e+00, -7.34125018e-01,  3.86333257e-01, -7.35499740e-01,
       -8.19209695e-01,  1.01545835e+00,  4.01012897e-01, -3.43701720e-01,
       -4.99951184e-01, -1.01978743e+00, -1.30751014e-01, -1.16642559e+00,
       -1.79975927e-01, -1.15340412e+00, -6.12371504e-01, -7.11321354e-01]]
        });


//        let profile_embeddings_to_array = Object.values(this.state.profile_embeddings);
//        let profile_embeddings_to_ndarray = pack(profile_embeddings_to_array);
        let profile_embeddings_to_ndarray = pack(this.state.profile_embeddings);
//        console.log("shape of profile embeddings:")
//        console.log(profile_embeddings_to_ndarray.shape);
        this.setState({
            profile_embeddings_ndarray: profile_embeddings_to_ndarray,
        });

        this.update_my_images()
    };

    goBack() {
        Actions.pop()
    }

    update_my_images() {
        this.setState({
            my_images: [],
        })
        console.log(this.state.my_images)
        for (var i = 0 ; i < this.state.tour_images_embeddings_ndarray.length; i++) {
            let distances = this.get_angular_distances(this.state.tour_images_embeddings_ndarray[i], this.state.profile_embeddings_ndarray);
            let argmax = ops.argmax(distances);
            let max = distances.get(argmax[0], argmax[1]);
            if (max > this.state.threshold) {
                this.getImage(this.state.file_names[i])
            }
        }
    }

    get_angular_distances(embs1, embs2) {
        // Returns Cosine Angular Distance Matrix of given 2 sets of embeddings.
        var distanceMatrix = ndarray(new Float32Array(embs1.shape[0] * embs2.shape[0]), [embs1.shape[0], embs2.shape[0]])
        gemm(distanceMatrix, embs1, embs2.transpose(1, 0))

        for (let i=0; i<embs1.shape[0]; ++i) {
            ops.divseq(distanceMatrix.pick(i, null), ops.norm2(embs1.pick(i, null)))
        }

        for (let j=0; j<embs2.shape[0]; ++j) {
            ops.divseq(distanceMatrix.pick(null, j), ops.norm2(embs2.pick(j, null)))
        }

        return distanceMatrix
    }

    saveData =async()=>{
        alert('Saving to local device finish in few seconds.');
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status == 'granted') {
            this.state.my_images.map(async (img_uri) => {
                let img_name = img_uri.split('%')[2].split('?')[0].substring(2);

                const file = await FileSystem.downloadAsync(
                    img_uri,
                    FileSystem.documentDirectory + img_name,
                );

                const asset = await MediaLibrary.createAssetAsync(file.uri);
                MediaLibrary.createAlbumAsync(this.state.tour.tour_name, asset)
                    .then(() => {
                        console.log('Album ' + this.state.tour.tour_name + ' created!');
                    })
                    .catch(error => {
                        console.log('err', error);
                    });
            }) /* map end */
        }

        this.goBack();
    };

    getImage = (image) => {
        const ref = firebase.storage().ref().child("tour_images/" + this.state.tour.tour_id + '/' + image);
        ref.getDownloadURL().then( (url) => {
            let append_my_images = this.state.my_images.concat(url);
            this.setState({
                my_images: append_my_images,
            })
        }).catch( (error) => {
            console.log('cannot get image from firebase');
        });
    };

    renderGridImages() {
        return this.state.my_images.map((image, index) => {
            return (
                <View key={index} style={[{ width: (width) / 3 }, { height: (width) / 3 }, { marginBottom: 2 }, index % 3 !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 }]}>
                    <Image style={{
                        flex: 1,
                        alignSelf: 'stretch',
                        width: undefined,
                        height: undefined,
                    }}
                           source={{ uri: image}}>
                    </Image>
                </View>
            )
        })
    }

    renderSection() {
        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 2, }}>
                {
                    this.renderGridImages()
                }
            </View>
        )
    }

    renderThumbnail() {
        return (
            <ImageBackground
                blurRadius={ Platform.OS == 'ios' ? 10 : 5 }
                source={{uri: this.state.tour.tour_thumbnail}}
                imageStyle={{ borderRadius: 0}}
                style={{flex:1, height:null, width:null,
                    resizeMode: 'cover', borderRadius:0,
                    justifyContent: 'center'}}>
                <View style={{...styles.overlay, borderRadius:0 }}>
                {
                    this.state.fontLoaded ? (
                        <Text style={{...styles.textInput, marginTop:10, fontSize: 40, fontFamily: 'EastSeaDokdo-Regular'}}>
                            {
                                this.state.tour.tour_name ?
                                    this.state.tour.tour_name : null
                            }
                        </Text>
                    ) : null
                }
                {
                    this.state.fontLoaded ? (
                        <Text style={{...styles.textInput, fontSize:20, marginVertical:0, color: '#868e96', fontFamily: 'Nanum_pen_Script-Regular', }}>
                            {
                                this.state.tour.tour_startedAt ?
                                    this.state.tour.tour_startedAt.toDate().toDateString() : null
                            }
                        </Text>
                    ) : null
                }
                {
                    <Text style={{...styles.textInput, fontSize: 30,fontFamily: 'EastSeaDokdo-Regular', }}>
                        {
                            this.state.tour.tour_location?
                                this.state.tour.tour_location: null
                        }
                    </Text>
                }
                </View>
            </ImageBackground>
        );
    }

    render() {
        return(
            <SafeAreaView style={styles.container}>
                <DownloadPicHeader title="Download Pictures" />

                <View
                    style={{
                        height : height / 5,
                        width: width,
                        marginTop: 5,
                    }}>
                    { this.state.tour.tour_thumbnail? this.renderThumbnail() : null }
                </View>

                <ScrollView style={{flex: 1, backgroundColor: 'white'}}>

                    <View style={{ flex: 1, }}>
                        {this.state.my_images? this.renderSection() : null }
                    </View>
                </ScrollView>

                    <View style={{ flexDirection:'row', justifyContent:'center'}}>
                        <Text>
                            { Math.round(this.state.threshold*100)/100 }
                        </Text>
                        <Slider 
//                            style={{width : width * 2 / 3, alignSelf:'center', marginTop:5,}}
                            style={{width : width * 2 / 3, marginTop:5,}}
                            maximumValue={1}
                            minimumValue={0}
                            minimumTrackTintColor="#307ecc"
                            maximumTrackTintColor="#000000"
                            step={0.05} 
                            value={this.state.threshold}
                            onValueChange={(sliderValue) => {
                                this.setState({ threshold : sliderValue, })
                                this.update_my_images()
                                }
                            }
                        />
                    </View>

                    <TouchableOpacity style={{...styles.button}}>
                        <Text style={{fontSize:20, fontWeight: 'bold'}} onPress={this.saveData}>
                            DOWNLOAD IMAGES
                        </Text>
                    </TouchableOpacity>

            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
//        backgroundColor: '#121212',
    },
    overlay: {
        flex:1,
        backgroundColor:'rgba(255,255,255,0.6)',
//        alignItems: 'center',
        justifyContent: 'center',
    },
    textInput:{
        marginHorizontal: 20,
        paddingLeft: 10,
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
//        alignSelf: 'center',
    },
    button: {
        backgroundColor: 'white',
        height: 50,
        marginHorizontal: 50,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        marginBottom: 15,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: 'black',
        shadowOpacity: 0.2,
        elevation: 2
    },
});
