import { createDrawerNavigator } from "@react-navigation/drawer";
import Principal from "./Principal";
import contas from "./contas";
import categorias from "./categorias";

const Drawer = createDrawerNavigator();

export default function MenuDrawer() {
    return (
        <Drawer.Navigator 
        //Estilizando as barras de navegação do drawer
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#40D40B',
                    elevation: 0,
                },
                headerTintColor: '#fff'
            }}
        >
            <Drawer.Screen name="Principal" component={Principal} />
            <Drawer.Screen name="Contas" component={contas} />
            <Drawer.Screen name="Categorias" component={categorias} />
        </Drawer.Navigator>
    )
}