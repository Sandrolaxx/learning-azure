package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

// Estrutura para mapear a resposta da API externa
// A API retorna um mapa onde a chave é "BTCBRL" (ou similar)
// e o valor é o objeto com os detalhes da cotação.
type AwesomeAPIResponse map[string]BitcoinQuote

// Estrutura para os detalhes da cotação do Bitcoin
type BitcoinQuote struct {
	Code       string `json:"code"`
	Codein     string `json:"codein"`
	Name       string `json:"name"`
	High       string `json:"high"`
	Low        string `json:"low"`
	VarBid     string `json:"varBid"`
	PctChange  string `json:"pctChange"`
	Bid        string `json:"bid"` // Preço de compra
	Ask        string `json:"ask"` // Preço de venda
	Timestamp  string `json:"timestamp"`
	CreateDate string `json:"create_date"`
}

// Variável global para armazenar a última cotação (simples, para demonstração)
// Em uma aplicação real, considere concorrência e atualizações periódicas.
var lastQuote BitcoinQuote
var lastFetchError error

const externalAPIURL = "https://economia.awesomeapi.com.br/json/last/btc"

// fetchBitcoinPrice busca a cotação mais recente da API externa
func fetchBitcoinPrice() (BitcoinQuote, error) {
	var apiResponse AwesomeAPIResponse
	var btcQuote BitcoinQuote

	// Timeout para a requisição HTTP
	client := http.Client{
		Timeout: 5 * time.Second,
	}

	resp, err := client.Get(externalAPIURL)
	if err != nil {
		return btcQuote, fmt.Errorf("erro ao fazer requisição para a API externa: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return btcQuote, fmt.Errorf("API externa retornou status não OK: %s", resp.Status)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return btcQuote, fmt.Errorf("erro ao ler o corpo da resposta: %v", err)
	}

	err = json.Unmarshal(body, &apiResponse)
	if err != nil {
		return btcQuote, fmt.Errorf("erro ao decodificar JSON da API externa: %v", err)
	}

	// A API retorna um mapa, precisamos pegar o valor dentro dele.
	// Assumindo que a chave é "BTCBRL" ou a primeira que aparecer.
	for _, quote := range apiResponse {
		btcQuote = quote
		break // Pegamos a primeira (e única, neste caso) cotação
	}

	if btcQuote.Code == "" {
		return btcQuote, fmt.Errorf("cotação de BTC não encontrada na resposta da API externa")
	}

	return btcQuote, nil
}

// bitcoinPriceHandler é o handler para nossa API local
func bitcoinPriceHandler(w http.ResponseWriter, r *http.Request) {
	if lastFetchError != nil {
		http.Error(w, fmt.Sprintf("Erro ao buscar dados: %v", lastFetchError), http.StatusInternalServerError)
		return
	}

	if lastQuote.Code == "" {
		http.Error(w, "Dados da cotação ainda não disponíveis", http.StatusServiceUnavailable)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(lastQuote)
}

// updateQuotePeriodically atualiza a cotação periodicamente
func updateQuotePeriodically() {
	ticker := time.NewTicker(1 * time.Hour) // Atualiza a cada 1 hora
	defer ticker.Stop()

	// Busca inicial
	log.Println("Buscando cotação inicial...")
	quote, err := fetchBitcoinPrice()
	if err != nil {
		log.Printf("Erro na busca inicial da cotação: %v", err)
		lastFetchError = err
	} else {
		lastQuote = quote
		lastFetchError = nil
		log.Printf("Cotação inicial carregada: %s", lastQuote.Bid)
	}

	for {
		select {
		case <-ticker.C:
			log.Println("Atualizando cotação do Bitcoin...")
			quote, err := fetchBitcoinPrice()
			if err != nil {
				log.Printf("Erro ao atualizar cotação: %v", err)
				lastFetchError = err
			} else {
				lastQuote = quote
				lastFetchError = nil
				log.Printf("Cotação atualizada: %s", lastQuote.Bid)
			}
		}
	}
}

func main() {
	// Inicia a busca periódica em uma goroutine separada
	go updateQuotePeriodically()

	// Define o handler para o endpoint /cotacao-btc
	http.HandleFunc("/cotacao-btc", bitcoinPriceHandler)

	port := "8080"
	log.Printf("Servidor API iniciado na porta %s. Acesse http://localhost:%s/cotacao-btc", port, port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}