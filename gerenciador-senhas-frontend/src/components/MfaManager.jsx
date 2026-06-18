import { Copy, ShieldCheck, ShieldOff } from "lucide-react";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  confirmarConfiguracaoMfa,
  consultarStatusMfa,
  desativarMfa,
  iniciarConfiguracaoMfa,
} from "../services/mfaService";

function MfaManager() {
  const [mfaAtivo, setMfaAtivo] = useState(false);
  const [setup, setSetup] = useState(null);
  const [codigoConfirmacao, setCodigoConfirmacao] = useState("");
  const [codigoDesativacao, setCodigoDesativacao] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarStatus();
  }, []);

  async function carregarStatus() {
    try {
      const status = await consultarStatusMfa();
      setMfaAtivo(status.ativo);
    } catch (error) {
      setErro("Não foi possível carregar o status do MFA.");
    }
  }

  function limparAvisos() {
    setMensagem("");
    setErro("");
  }

  async function iniciarSetup() {
    limparAvisos();
    setCodigoConfirmacao("");

    try {
      const dados = await iniciarConfiguracaoMfa();
      setSetup(dados);
      setMensagem(
        "Chave MFA gerada. Adicione no aplicativo autenticador e confirme o código."
      );
    } catch (error) {
      setErro(error.response?.data?.erro || "Erro ao iniciar MFA.");
    }
  }

  async function confirmarSetup(event) {
    event.preventDefault();
    limparAvisos();

    try {
      await confirmarConfiguracaoMfa(codigoConfirmacao);
      setMfaAtivo(true);
      setSetup(null);
      setCodigoConfirmacao("");
      setMensagem("MFA ativado com sucesso.");
    } catch (error) {
      setErro(error.response?.data?.erro || "Código MFA inválido.");
    }
  }

  async function desativar(event) {
    event.preventDefault();
    limparAvisos();

    try {
      await desativarMfa(senhaAtual, codigoDesativacao);
      setMfaAtivo(false);
      setSenhaAtual("");
      setCodigoDesativacao("");
      setMensagem("MFA desativado com sucesso.");
    } catch (error) {
      setErro(error.response?.data?.erro || "Erro ao desativar MFA.");
    }
  }

  async function copiar(texto) {
    try {
      await navigator.clipboard.writeText(texto);
      setMensagem("Copiado para a área de transferência.");
    } catch (error) {
      setErro("Não foi possível copiar automaticamente.");
    }
  }

  return (
    <section className="mfa-manager">
      <div className="mfa-manager-header">
        <div>
          <h3>Segurança da conta</h3>
          <p>Autenticação multifator por aplicativo TOTP.</p>
        </div>

        <span className={mfaAtivo ? "mfa-badge active" : "mfa-badge inactive"}>
          {mfaAtivo ? "MFA ativo" : "MFA inativo"}
        </span>
      </div>

      {mensagem && <div className="alert alert-success">{mensagem}</div>}
      {erro && <div className="alert alert-error">{erro}</div>}

      {!mfaAtivo && !setup && (
        <button className="btn btn-secondary full-button" type="button" onClick={iniciarSetup}>
          <ShieldCheck size={17} />
          Ativar MFA
        </button>
      )}

      {!mfaAtivo && setup && (
        <div className="mfa-setup-box">
          <p>
            Escaneie o QR Code abaixo com Google Authenticator, Microsoft
            Authenticator, Aegis, 2FAS ou outro aplicativo compatível com TOTP.
          </p>

          {setup.otpauthUri && (
            <div className="mfa-qrcode-area">
              <div className="mfa-qrcode-card">
                <QRCodeSVG
                  value={setup.otpauthUri}
                  size={220}
                  level="M"
                  title="QR Code para ativar MFA no NexoVault"
                />
              </div>

              <p className="mfa-qrcode-help">
                Aponte a câmera do aplicativo autenticador para este QR Code.
              </p>
            </div>
          )}

          <p>
            Caso prefira, adicione a conta manualmente usando a chave abaixo.
          </p>

          <div className="mfa-secret-box">
            <code>{setup.secret}</code>

            <button
              type="button"
              className="icon-button"
              onClick={() => copiar(setup.secret)}
              title="Copiar chave"
              aria-label="Copiar chave"
            >
              <Copy size={17} />
            </button>
          </div>

          <form onSubmit={confirmarSetup}>
            <label>
              Código de 6 dígitos
              <input
                value={codigoConfirmacao}
                onChange={(event) =>
                  setCodigoConfirmacao(
                    event.target.value.replace(/\D/g, "").slice(0, 6)
                  )
                }
                placeholder="000000"
                inputMode="numeric"
                maxLength={6}
                required
              />
            </label>

            <button className="btn btn-primary full-button" type="submit">
              Confirmar e ativar MFA
            </button>
          </form>
        </div>
      )}

      {mfaAtivo && (
        <form className="mfa-disable-form" onSubmit={desativar}>
          <label>
            Senha atual
            <input
              type="password"
              value={senhaAtual}
              onChange={(event) => setSenhaAtual(event.target.value)}
              required
            />
          </label>

          <label>
            Código MFA
            <input
              value={codigoDesativacao}
              onChange={(event) =>
                setCodigoDesativacao(
                  event.target.value.replace(/\D/g, "").slice(0, 6)
                )
              }
              placeholder="000000"
              inputMode="numeric"
              maxLength={6}
              required
            />
          </label>

          <button className="btn btn-danger full-button" type="submit">
            <ShieldOff size={17} />
            Desativar MFA
          </button>
        </form>
      )}
    </section>
  );
}

export default MfaManager;
