import { useTheme } from '@/hooks/useTheme';
import { useUser } from '@/hooks/useUser';
import { useEffect, useState } from 'react';
import GooglePlacesTextInput, { GooglePlacesTextInputStyles } from 'react-native-google-places-textinput';
import { ThemedView } from '../ui';

const AddressSearch = () => {
    const placesApi = process.env.EXPO_PUBLIC_PLACES_API
    const [inputState, setInputState] = useState('')
    const { colors, theme } = useTheme()
    const { searchLocation, handleSearchLocation, usingCurrLocation } = useUser()

    const handleValChange = (vc:string) => {
        if (vc === ""){
            console.log("empty!")
            handleSearchLocation()
        }
    }

    const handlePlaceSelect = (place) => {
        console.log('Selected place:', place);
        console.log(place.details)
        const address = place.details.formattedAddress;
        // Truncate if too long (approx 25 chars for 170px width)
        const truncatedAddress = address.length > 25 ? address.substring(0, 22) + '...' : address;
        setInputState(truncatedAddress)
        console.log(place.details.formattedAddress)

        handleSearchLocation(place?.details)
    };
    useEffect(() => {
      if (searchLocation){
        const address = searchLocation.formattedAddress;
        // Truncate if too long when disabled
        const truncatedAddress = address.length > 25 ? address.substring(0, 22) + '...' : address;
        setInputState(truncatedAddress)
      }

    }, [])

    // const handleTextChange = (tval: string) => {
    //     if (tval === "") {
    //         setInputState("Your Location")
    //     }
    // }

    const customStyles: GooglePlacesTextInputStyles = {
        container: {
            overflow: 'visible',
            width: '100%',
            marginHorizontal: 0,
            backgroundColor: 'transparent',
            zIndex: 1000,
        },
        input: {
            height: 45,
            borderWidth: 1,
            borderColor: usingCurrLocation ? colors.iconColor : colors.primary,
            borderRadius: 8,
            width: 170,
            paddingHorizontal: 12,
            paddingVertical: 12,
            pointerEvents: usingCurrLocation ? "none" : "auto",
            backgroundColor: usingCurrLocation
                ? (theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)')
                : (theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)'),
            color: usingCurrLocation ? colors.iconColor : colors.text,
            opacity: usingCurrLocation ? 0.5 : 1,
        },
        suggestionsContainer: {
            maxHeight: 250,
            overflow: 'visible',
            position: 'absolute',
            top: 50,
            left: 0,
            right: 0,
            backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            zIndex: 9999,
        },
        suggestionItem: {
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme === 'dark' ? '#374151' : '#E5E7EB',
            backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
        },
        suggestionText: {
            main: {
                fontSize: 16,
                color: theme === 'dark' ? '#F9FAFB' : '#111827',
                fontWeight: '500',
            },
            secondary: {
                fontSize: 14,
                color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
            }
        },
        loadingIndicator: {
            color: colors.primary,
        },
        placeholder: {
            color: colors.iconColor,
        }
    };

  return !placesApi ? null : (
    
    <ThemedView style={{backgroundColor:'transparent'}}>
       
    <GooglePlacesTextInput
      apiKey={placesApi}
      onPlaceSelect={handlePlaceSelect}
      placeHolderText='Search'
      value={inputState}
      fetchDetails={true}
      style={customStyles}
      minCharsToFetch={4}
      onTextChange={handleValChange}
    />
    
    
    </ThemedView>
   
  );
};
export default AddressSearch