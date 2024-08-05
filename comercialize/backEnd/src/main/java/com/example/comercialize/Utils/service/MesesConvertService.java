package com.example.comercialize.Utils.service;

import com.example.comercialize.Utils.Interfaces.Meses;
import org.springframework.stereotype.Service;

@Service
public class MesesConvertService {

    public String monthConververter(String mes) {
            String mesConvertido = "";
            switch (mes) {
                case Meses.JANEIRO:
                    mesConvertido = "JANEIRO";
                    break;
                case Meses.FEVEREIRO:
                    mesConvertido = "FEVEREIRO";
                    break;
                case Meses.MARCO:
                    mesConvertido = "MARCO";
                    break;
                case Meses.ABRIL:
                    mesConvertido = "ABRIL";
                    break;
                case Meses.MAIO:
                    mesConvertido = "MAIO";
                    break;
                case Meses.JUNHO:
                    mesConvertido = "JUNHO";
                    break;
                case Meses.JULHO:
                    mesConvertido = "JULHO";
                    break;
                case Meses.AGOSTO:
                    mesConvertido = "AGOSTO";
                    break;
                case Meses.SETEMBRO:
                    mesConvertido = "SETEMBRO";
                    break;
                case Meses.OUTUBRO:
                    mesConvertido = "OUTUBRO";
                    break;
                case Meses.NOVEMBRO:
                    mesConvertido = "NOVEMBRO";
                    break;
                case Meses.DEZEMBRO:
                    mesConvertido = "DEZEMBRO";
                    break;
            }
        return mesConvertido;
    }
}
