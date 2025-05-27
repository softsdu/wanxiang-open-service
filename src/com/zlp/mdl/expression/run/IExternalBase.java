package com.zlp.mdl.expression.run;

public interface IExternalBase{
	IDatabaseAccess getDatabaseAccess();

	IDocumentAccess getDocumentAccess();

	ISystemModelAccess getSystemModelAccess();
}
