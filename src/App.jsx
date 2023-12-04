import { validate } from "./validate";
import { useState } from "react";
import { Alert } from "./Alert";

function App() {
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [danger, setDanger] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccess(false);
    setDanger(false);

    const code = event.target.inputCode.value;
    let result = await validate(code);

    console.log(result);
    setMessage(result.msg);


    if (result.success) {
      setSuccess(true);
    } else {
      setDanger(true);
    }
  };
  return (
      <div className="container mt-4">
        <div className="card text-center">
          <div className="card-body">
            <h5 className="card-title">NOVA</h5>
            <div className="row justify-content-center">
              <div className="col-auto col-lg-5">
                <form onSubmit={handleSubmit}>
                  <label htmlFor="inputCode" className="form-label">
                    Inserte fragmento de código
                  </label>
                  <textarea
                      type="text"
                      id="inputCode"
                      className="form-control mb-2"
                      style={{ height: "200px" }}
                  />
                  <button type="submit" className="btn btn-primary">
                    Validar
                  </button>
                </form>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="card-text mt-3 col-auto">
                {success && <Alert message="Código válido" type="success" />}
                {danger && <Alert message="Código no válido" type="danger" />}
                {danger && message}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default App;
