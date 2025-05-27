package com.zlp.mdl.expression.run;

import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import com.zlp.platform.dao.db.IDBParserAccess;
import com.zlp.platform.dao.db.ISequenceGenerator;

public class DatabaseAccess implements IDatabaseAccess{
	
	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	
	private Session session;
	public Session getSession(){
		return this.session;
	}
	public void setSession(Session session){
		this.session = session;
	}
	public Session newSession(){
		Session dbSession = this.transactionManager.getSessionFactory().openSession(); 
		return dbSession;
	}

	public void openSession(){
		this.session = this.newSession();
	}
	
	private IDBParserAccess dBParserAccess;
	public IDBParserAccess getDBParserAccess(){
		return this.dBParserAccess;
	}
	public void setDBParserAccess(IDBParserAccess dBParserAccess){
		this.dBParserAccess = dBParserAccess;
	}

	private ISequenceGenerator sequenceGenerator;
	public ISequenceGenerator getSequenceGenerator(){
		return this.sequenceGenerator;
	}
	public void setSequenceGenerator(ISequenceGenerator sequenceGenerator){
		this.sequenceGenerator = sequenceGenerator;
	}
}
