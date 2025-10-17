import { useTheme } from '@/hooks/useTheme';
import { useUser } from '@/hooks/useUser';
import { useState } from 'react';
import GooglePlacesTextInput from 'react-native-google-places-textinput';
import { ThemedButton, ThemedText, ThemedView } from '../ui';
interface AddressSearchProps {
    handlePickMade: ()=>void
}
const AddressSearch = ({handlePickMade}:AddressSearchProps) => {
    const placesApi = "AIzaSyAxR8PtmkqEcpCrwSGr-AESqQFhbprCPTI"
    const [inputState, setInputState] = useState('')
    const {colors} = useTheme()
    const { searchLocation, handleSearchLocation} = useUser()
    const [locButtonSeen, setLocButtonSeen] = useState(false)

  const handlePlaceSelect = (place) => {
    console.log('Selected place:', place);
    
    handleSearchLocation(place?.text || "")
    setLocButtonSeen(false)
    handlePickMade()
  };
  const handleTextChange = (tval:string) => {
    if (tval === ""){
        setInputState("Your Location")
    }
  }
  const customStyles = {
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
      width:200,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: colors.text,
      

      
    },
    suggestionsContainer: {
      
      maxHeight: 250,
      overflow:'visible',
      position:'absolute',
      top:90,
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
      placeHolderText='Your Location'
      value={inputState}
      onTextChange={handleTextChange}
      style={customStyles}
      onFocus={() => setLocButtonSeen(true)}
      
      
      
    />
    {locButtonSeen && (
        <ThemedButton style={{position:'absolute',top:40,left:0}} onPress={() => handlePlaceSelect("")}>
            <ThemedText style={{textDecorationLine:'underline'}}>Current Location</ThemedText>
        </ThemedButton>
    )}
    </ThemedView>
  );
};
export default AddressSearch