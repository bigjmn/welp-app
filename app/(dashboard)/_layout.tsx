import { Tabs } from 'expo-router';
export default function DashboardLayout(){
    return (<Tabs screenOptions={{headerShown: false}}>
        <Tabs.Screen name="index" options={{tabBarStyle: {display:"none"}}} />
        <Tabs.Screen name="result" options={{tabBarStyle: {display:"none"}}} />
        <Tabs.Screen name="profile" options={{tabBarStyle:{display:'none'}}} />
        <Tabs.Screen name="about" options={{tabBarStyle:{display:'none'}}} />
        <Tabs.Screen name="review" options={{tabBarStyle:{display:'none'}}} />
    </Tabs>)
}