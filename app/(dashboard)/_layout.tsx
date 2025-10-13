import { Tabs } from 'expo-router';
export default function DashboardLayout(){
    return (<Tabs screenOptions={{headerShown: false}}>
        <Tabs.Screen name="index" options={{tabBarStyle: {display:"none"}}} />
    </Tabs>)
}