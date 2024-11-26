'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { AlertCircle, Search, Activity, Globe, FileText } from 'lucide-react'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

// Dados de exemplo - substitua por dados reais da sua API
const trafficData = [
  { name: 'Seg', value: 4000 },
  { name: 'Ter', value: 3000 },
  { name: 'Qua', value: 2000 },
  { name: 'Qui', value: 2780 },
  { name: 'Sex', value: 1890 },
  { name: 'Sab', value: 2390 },
  { name: 'Dom', value: 3490 },
]

const anomalies = [
  { id: 1, description: 'Tráfego anormal detectado na porta 443', severity: 'Alta', ip: '192.168.1.100' },
  { id: 2, description: 'Múltiplas tentativas de login falhadas', severity: 'Média', ip: '10.0.0.5' },
  { id: 3, description: 'Scan de portas detectado', severity: 'Baixa', ip: '172.16.0.1' },
]

export default function Dashboard() {
  const [shodanQuery, setShodanQuery] = useState('')
  const [shodanResults, setShodanResults] = useState(null)
  const [selectedAnomaly, setSelectedAnomaly] = useState(null)

  useEffect(() => {
    if (selectedAnomaly) {
      handleShodanSearch(selectedAnomaly.ip)
    }
  }, [selectedAnomaly])

  const handleShodanSearch = async (ip) => {
    // Simula uma busca no SHODAN - substitua por uma chamada real à API
    console.log('Pesquisando no SHODAN:', ip)
    // Simula um resultado do SHODAN
    const mockResult = {
      ip: ip,
      country: 'Brasil',
      city: 'São Paulo',
      isp: 'Exemplo ISP',
      open_ports: [80, 443, 22]
    }
    setShodanResults(mockResult)
  }

  const generatePDF = () => {
    const doc = new jsPDF()
    
    doc.text('Relatório de Detecção de Intrusão', 14, 15)
    
    // Adiciona informações sobre anomalias
    doc.text('Anomalias Detectadas:', 14, 25)
    const anomalyData = anomalies.map(a => [a.id, a.description, a.severity, a.ip])
    doc.autoTable({
      startY: 30,
      head: [['ID', 'Descrição', 'Severidade', 'IP']],
      body: anomalyData,
    })
    
    // Adiciona informações do SHODAN se disponíveis
    if (shodanResults) {
      doc.text('Informações do SHODAN:', 14, doc.lastAutoTable.finalY + 10)
      doc.text(`IP: ${shodanResults.ip}`, 14, doc.lastAutoTable.finalY + 20)
      doc.text(`País: ${shodanResults.country}`, 14, doc.lastAutoTable.finalY + 30)
      doc.text(`Cidade: ${shodanResults.city}`, 14, doc.lastAutoTable.finalY + 40)
      doc.text(`ISP: ${shodanResults.isp}`, 14, doc.lastAutoTable.finalY + 50)
      doc.text(`Portas abertas: ${shodanResults.open_ports.join(', ')}`, 14, doc.lastAutoTable.finalY + 60)
    }
    
    doc.save('relatorio-deteccao-intrusao.pdf')
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Sistema de Detecção de Intrusão</h1>
      
      <Tabs defaultValue="traffic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="traffic">Tráfego de Rede</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalias</TabsTrigger>
          <TabsTrigger value="shodan">SHODAN</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic">
          <Card>
            <CardHeader>
              <CardTitle>Visualização de Tráfego de Rede</CardTitle>
              <CardDescription>Tráfego de rede dos últimos 7 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anomalies">
          <Card>
            <CardHeader>
              <CardTitle>Alertas de Anomalias</CardTitle>
              <CardDescription>Anomalias detectadas recentemente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {anomalies.map((anomaly) => (
                  <Alert 
                    key={anomaly.id} 
                    variant={anomaly.severity === 'Alta' ? 'destructive' : 'default'}
                    className="cursor-pointer"
                    onClick={() => setSelectedAnomaly(anomaly)}
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Severidade: {anomaly.severity}</AlertTitle>
                    <AlertDescription>
                      {anomaly.description}
                      <br />
                      <strong>IP: {anomaly.ip}</strong>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shodan">
          <Card>
            <CardHeader>
              <CardTitle>Informações do SHODAN</CardTitle>
              <CardDescription>Detalhes do IP anômalo selecionado</CardDescription>
            </CardHeader>
            <CardContent>
              {shodanResults ? (
                <div>
                  <p><strong>IP:</strong> {shodanResults.ip}</p>
                  <p><strong>País:</strong> {shodanResults.country}</p>
                  <p><strong>Cidade:</strong> {shodanResults.city}</p>
                  <p><strong>ISP:</strong> {shodanResults.isp}</p>
                  <p><strong>Portas abertas:</strong> {shodanResults.open_ports.join(', ')}</p>
                </div>
              ) : (
                <p>Selecione uma anomalia para ver as informações do SHODAN</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas de Tráfego</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Tráfego total hoje: 15.67 GB</span>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Globe className="h-4 w-4" />
              <span>IPs únicos: 1,234</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Sistema operacional</span>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Atualização disponível</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Button onClick={generatePDF}>
          <FileText className="mr-2 h-4 w-4" /> Gerar Relatório PDF
        </Button>
      </div>
    </div>
  )
}