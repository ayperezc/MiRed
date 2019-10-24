import React from "react";
// import SolicitudAmistad from "./SolicitudAmistad";
import MiRed from "./components/MiRed";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      persons: [],
      idUsuario: "1",
      idsAmigos: [],
      amigos: []
    };
    this.aceptar = this.aceptar.bind(this);
    this.rechazar = this.rechazar.bind(this);
  }
  buscarAmigos(params) {
    let aux = [];
    params.forEach(idAmigo => {
      // console.log(idAmigo);
      // console.log(this.state.persons);
      this.state.persons.forEach(person => {
        if (idAmigo == person.id) {
          aux.push(person);
        }
      });
    });
    // console.log(aux);
    this.setState({ amigos: aux });
  }
  pedirUsuarios() {
    const query = `
        query{
            getUsuarios{
                id
                nombre
                apellido
                email
                identificacion
                nacionalidad
                perf_profesional
                perf_personal
            }
        }
    `;
    const url =
      "https://cors-anywhere.herokuapp.com/http://35.198.21.214:3050/graphql";
    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ query })
    };
    fetch(url, opts)
      .then(res => res.json())
      .then(e => {
        this.setState({ persons: e.data.getUsuarios });
        this.forceUpdate();
        this.pedirRelacionesDelUsuario();
      })
      .catch(console.error);
  }
  pedirRelacionesDelUsuario() {
    const query =
      `
        query{
            RelacionU(id: "` +
      this.state.idUsuario +
      `"){
                friends
            }
        }
    `;
    const url =
      "https://cors-anywhere.herokuapp.com/http://35.198.21.214:3050/graphql";
    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ query })
    };
    fetch(url, opts)
      .then(res => res.json())
      .then(e => {
        this.setState({ idsAmigos: e.data.RelacionU[0].friends });
        this.forceUpdate();
        this.buscarAmigos(this.state.idsAmigos);
      })
      .catch(console.error);
  }
  componentDidMount() {
    this.pedirUsuarios();
  }
  aceptar() {
    alert("Logica de aceptar");
  }
  rechazar() {
    alert("Logica de rechazar");
  }

  render() {
    return (
      <div>
        {/* <SolicitudAmistad
          persona={this.state.persons.indexOf(0)}
          aceptar={this.aceptar}
          rechazar={this.rechazar}
        /> */}
        <MiRed personas={this.state.amigos} />
      </div>
    );
  }
}

export default App;
