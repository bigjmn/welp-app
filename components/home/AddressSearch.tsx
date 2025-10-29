import { useTheme } from '@/hooks/useTheme';
import { useUser } from '@/hooks/useUser';
import { useState } from 'react';
import GooglePlacesTextInput, { GooglePlacesTextInputStyles } from 'react-native-google-places-textinput';
import { ThemedView } from '../ui';
interface AddressSearchProps {
    canSearch: boolean
}
const AddressSearch = () => {
    const placesApi = "AIzaSyAxR8PtmkqEcpCrwSGr-AESqQFhbprCPTI"
    const [inputState, setInputState] = useState('')
    const {colors} = useTheme()
    const { searchLocation, handleSearchLocation, usingCurrLocation} = useUser()

  const handlePlaceSelect = (place) => {
    console.log('Selected place:', place);
    console.log(place.details)
    setInputState(place.details.formattedAddress)
    console.log(place.details.formattedAddress)
    
    handleSearchLocation(place?.details)
    
    
  };
  const handleTextChange = (tval:string) => {
    if (tval === ""){
        setInputState("Your Location")
    }
  }
  const customStyles:GooglePlacesTextInputStyles = {
    container: {
        
        
        overflow:'visible',
      width: '100%',
      marginHorizontal: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)'


      
    },
    input: {
      
      height: 45,
      borderColor: '#ccc',
      borderRadius: 8,
      width:170,
      overflow:"scroll",
      pointerEvents:usingCurrLocation? "none" : "auto",
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: colors.text,
      

      
    },
    suggestionsContainer: {
      
      maxHeight: 250,
      overflow:'visible',
      position:'absolute',
      
      left:0
    },
    suggestionItem: {
      padding: 15,
    },
    suggestionText: {
      main: {
        fontSize: 16,
        color: '#333',
      },
      secondary: {
        fontSize: 14,
        color: '#666',
      }
    },
    loadingIndicator: {
      color: '#999',
    },
    placeholder: {
      color: '#999',
    }
  };

  return (
    
    <ThemedView style={{backgroundColor:'transparent'}}>
       
    <GooglePlacesTextInput
      apiKey={placesApi}
      onPlaceSelect={handlePlaceSelect}
      placeHolderText='Search'
      value={inputState}
      fetchDetails={true}
      
      
      onTextChange={handleTextChange}
      style={customStyles}
      minCharsToFetch={4}
      
      
      
      
      
    />
    
    
    </ThemedView>
   
  );
};
export default AddressSearch