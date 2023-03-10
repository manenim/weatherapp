import React from 'react';
import {
  View,
  StyleSheet,
  Button,
  Modal,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  FlatList,
} from 'react-native';

const ModalPoup = ({visible, children}) => {
  const [showModal, setShowModal] = React.useState(visible);
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    toggleModal();
    
  }, [visible]);
  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setShowModal(false), 200);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackGround}>
        <Animated.View
          style={[styles.modalContainer, {transform: [{scale: scaleValue}]}]}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const ModalComp = ({favorites}) => {
  const [visible, setVisible] = React.useState(false);
  favorites && console.log(favorites, 'from modal');
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ModalPoup visible={visible}>
        <View style={{alignItems: 'center'}}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text>Close</Text>
                
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
            <FlatList
        data={favorites}
        renderItem={({item}) => <Text style={{fontSize: 20, textAlign: 'center'}}>{item.name}</Text>}
      />
         
        </View>

      </ModalPoup>
      {/* <Button title="Open Modal" onPress={() => setVisible(true)} /> */}
      <TouchableOpacity style={styles.button}
                onPress={() => setVisible(true)}
              >
            <Text>View Favourites</Text>
            </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  button: {
    position: 'relative',
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    width: '40%',
    borderRadius: 10,
    padding: 8,
    marginTop: 8
  },
});

export default ModalComp;