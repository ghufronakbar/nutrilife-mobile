import {
  CheckCircle2,
  MessageCircleWarningIcon,
  XCircleIcon,
} from 'lucide-react-native';
import { Text, View } from 'react-native';
import { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';

/*
  1. Create the config
*/
export const ToastProvider: ToastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'transparent',
        height: 'auto',
        backgroundColor: 'transparent',
        shadowColor: 'transparent',
      }}
      contentContainerStyle={{ height: 'auto' }}
      text1={undefined}
      renderLeadingIcon={() => (
        <View
          style={{
            height: 'auto',
            width: '100%',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'transparent',
          }}
        >
          <View
            style={{
              height: 'auto',
              width: '50%',
              flexDirection: 'column',
              alignItems: 'center',
              paddingVertical: 15,
              paddingHorizontal: 10,
              gap: 5,
              backgroundColor: 'white',
              borderRadius: 20,
            }}
          >
            <CheckCircle2 size={40} color={'#22C55E'} />
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {props.text1}
            </Text>
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
              }}
            >
              {props.text2}
            </Text>
          </View>
        </View>
      )}
      text1Style={{}}
    />
  ),

  info: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'transparent',
        height: 'auto',
        backgroundColor: 'transparent',
        shadowColor: 'transparent',
      }}
      contentContainerStyle={{ height: 'auto' }}
      text1={undefined}
      renderLeadingIcon={() => (
        <View
          style={{
            height: 'auto',
            width: '100%',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'transparent',
          }}
        >
          <View
            style={{
              height: 'auto',
              width: '50%',
              flexDirection: 'column',
              alignItems: 'center',
              paddingVertical: 15,
              paddingHorizontal: 10,
              gap: 5,
              backgroundColor: 'white',
              borderRadius: 20,
            }}
          >
            <MessageCircleWarningIcon size={40} color={'#FBBF24'} />
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {props.text1}
            </Text>
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
              }}
            >
              {props.text2}
            </Text>
          </View>
        </View>
      )}
      text1Style={{}}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: 'transparent',
        height: 'auto',
        backgroundColor: 'transparent',
        shadowColor: 'transparent',
      }}
      contentContainerStyle={{ height: 'auto' }}
      text1={undefined}
      renderLeadingIcon={() => (
        <View
          style={{
            height: 'auto',
            width: '100%',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'transparent',
          }}
        >
          <View
            style={{
              height: 'auto',
              width: '50%',
              flexDirection: 'column',
              alignItems: 'center',
              paddingVertical: 15,
              paddingHorizontal: 10,
              gap: 5,
              backgroundColor: 'white',
              borderRadius: 20,
            }}
          >
            <XCircleIcon size={40} color={'#EF4444'} />
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {props.text1}
            </Text>
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
              }}
            >
              {props.text2}
            </Text>
          </View>
        </View>
      )}
      text1Style={{}}
    />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  tomatoToast: ({ text1, props }) => (
    <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  ),
};
