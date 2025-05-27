package com.zlp.mdl.expression.run;

public class ExternalBase implements IExternalBase{
	private IDatabaseAccess databaseAccess;
	public void setDatabaseAccess(IDatabaseAccess databaseAccess){
		this.databaseAccess = databaseAccess;
	}
	public IDatabaseAccess getDatabaseAccess(){
		return this.databaseAccess;
	}

	private IDocumentAccess documentAccess;
	public void setDocumentAccess(IDocumentAccess documentAccess){
		this.documentAccess = documentAccess;
	}
	public IDocumentAccess getDocumentAccess(){
		return this.documentAccess;
	}

	private ISystemModelAccess systemModelAccess;
	public void setSystemModelAccess(ISystemModelAccess systemModelAccess){
		this.systemModelAccess = systemModelAccess;
	}
	public ISystemModelAccess getSystemModelAccess(){
		return this.systemModelAccess;
	}
}
